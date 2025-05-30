#!/usr/bin/env node

/**
 * Chunk Loading Fix Script
 * Helps diagnose and fix common chunk loading issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(PROJECT_ROOT, '.next');
const BUILD_MANIFEST = path.join(NEXT_DIR, 'build-manifest.json');
const CHUNKS_DIR = path.join(NEXT_DIR, 'static', 'chunks');

console.log('🔧 Chunk Loading Diagnostic Tool\n');

function checkNextBuild() {
  console.log('📋 Checking Next.js build status...');
  
  if (!fs.existsSync(NEXT_DIR)) {
    console.log('❌ No .next directory found. Run "npm run build" first.');
    return false;
  }
  
  if (!fs.existsSync(BUILD_MANIFEST)) {
    console.log('❌ No build manifest found. Build may be incomplete.');
    return false;
  }
  
  console.log('✅ Next.js build directory exists');
  return true;
}

function analyzeChunks() {
  console.log('\n📊 Analyzing chunk structure...');
  
  if (!fs.existsSync(CHUNKS_DIR)) {
    console.log('❌ No chunks directory found');
    return;
  }
  
  const chunks = fs.readdirSync(CHUNKS_DIR);
  const greenComponentChunks = chunks.filter(chunk => 
    chunk.includes('green') || chunk.includes('Green')
  );
  
  console.log(`📦 Total chunks: ${chunks.length}`);
  console.log(`🌱 Green component chunks: ${greenComponentChunks.length}`);
  
  if (greenComponentChunks.length > 0) {
    console.log('\n🌱 Green component chunks:');
    greenComponentChunks.forEach(chunk => {
      const chunkPath = path.join(CHUNKS_DIR, chunk);
      const stats = fs.statSync(chunkPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  - ${chunk} (${sizeKB} KB)`);
    });
  }
}

function checkBuildManifest() {
  console.log('\n📋 Checking build manifest...');
  
  try {
    const manifest = JSON.parse(fs.readFileSync(BUILD_MANIFEST, 'utf8'));
    
    const pages = Object.keys(manifest.pages);
    const greenPages = pages.filter(page => page.includes('green'));
    
    console.log(`📄 Total pages: ${pages.length}`);
    console.log(`🌱 Green pages: ${greenPages.length}`);
    
    if (greenPages.length > 0) {
      console.log('\n🌱 Green pages in manifest:');
      greenPages.forEach(page => {
        const chunks = manifest.pages[page];
        console.log(`  - ${page}: ${chunks.length} chunks`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to read build manifest:', error.message);
    return false;
  }
}

function cleanBuildCache() {
  console.log('\n🧹 Cleaning build cache...');
  
  try {
    // Remove .next directory
    if (fs.existsSync(NEXT_DIR)) {
      execSync(`rm -rf "${NEXT_DIR}"`, { stdio: 'inherit' });
      console.log('✅ Removed .next directory');
    }
    
    // Remove node_modules/.cache
    const cacheDir = path.join(PROJECT_ROOT, 'node_modules', '.cache');
    if (fs.existsSync(cacheDir)) {
      execSync(`rm -rf "${cacheDir}"`, { stdio: 'inherit' });
      console.log('✅ Removed node_modules/.cache');
    }
    
    console.log('✅ Build cache cleaned');
    return true;
  } catch (error) {
    console.log('❌ Failed to clean cache:', error.message);
    return false;
  }
}

function rebuildProject() {
  console.log('\n🔨 Rebuilding project...');
  
  try {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: PROJECT_ROOT });
    
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit', cwd: PROJECT_ROOT });
    
    console.log('✅ Project rebuilt successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to rebuild project:', error.message);
    return false;
  }
}

function generateDiagnosticReport() {
  console.log('\n📊 Generating diagnostic report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    nextBuildExists: fs.existsSync(NEXT_DIR),
    buildManifestExists: fs.existsSync(BUILD_MANIFEST),
    chunksDirectoryExists: fs.existsSync(CHUNKS_DIR),
    totalChunks: 0,
    greenComponentChunks: 0,
    recommendations: []
  };
  
  if (fs.existsSync(CHUNKS_DIR)) {
    const chunks = fs.readdirSync(CHUNKS_DIR);
    report.totalChunks = chunks.length;
    report.greenComponentChunks = chunks.filter(chunk => 
      chunk.includes('green') || chunk.includes('Green')
    ).length;
  }
  
  // Add recommendations
  if (!report.nextBuildExists) {
    report.recommendations.push('Run "npm run build" to create build artifacts');
  }
  
  if (report.totalChunks === 0) {
    report.recommendations.push('No chunks found - build may have failed');
  }
  
  if (report.greenComponentChunks === 0) {
    report.recommendations.push('No green component chunks found - check component exports');
  }
  
  const reportPath = path.join(PROJECT_ROOT, 'chunk-diagnostic-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📄 Diagnostic report saved to: ${reportPath}`);
  return report;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'check':
      checkNextBuild();
      analyzeChunks();
      checkBuildManifest();
      generateDiagnosticReport();
      break;
      
    case 'clean':
      cleanBuildCache();
      break;
      
    case 'rebuild':
      cleanBuildCache();
      rebuildProject();
      break;
      
    case 'fix':
      console.log('🔧 Running complete fix process...');
      cleanBuildCache();
      if (rebuildProject()) {
        checkNextBuild();
        analyzeChunks();
        generateDiagnosticReport();
        console.log('\n✅ Fix process completed successfully!');
      }
      break;
      
    default:
      console.log(`
Usage: node scripts/fix-chunk-loading.js <command>

Commands:
  check   - Analyze current build and chunk status
  clean   - Clean build cache and temporary files
  rebuild - Clean cache and rebuild the project
  fix     - Run complete fix process (clean + rebuild + check)

Examples:
  node scripts/fix-chunk-loading.js check
  node scripts/fix-chunk-loading.js fix
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkNextBuild,
  analyzeChunks,
  checkBuildManifest,
  cleanBuildCache,
  rebuildProject,
  generateDiagnosticReport
};
