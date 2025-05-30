"use client"

import { useState, useRef, useEffect } from "react"
import { GreanButton } from "@/components/ui/grean-button"
import { GreanCard } from "@/components/ui/grean-card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/hooks/useTheme"
import { Download, Printer, Eye, FileText, Save, Settings, Layout, Upload, Copy } from "lucide-react"
import Image from "next/image"

export default function LetterheadPage() {
  const { effectiveTheme } = useTheme()
  const isDarkMode = effectiveTheme === 'dark'

  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState<'professional' | 'modern' | 'executive'>('professional')

  // Letter content state
  const [letterContent, setLetterContent] = useState<{
    date: string
    recipient: string
    subject: string
    body: string
    signature: string
    name: string
    position: string
    department: string
    phone: string
    email: string
  }>({
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    recipient: "John Smith\nABC Company\n123 Business Road\nAddis Ababa, Ethiopia",
    subject: "Sustainable Energy Solutions Proposal",
    body: `Dear Mr. Smith,

Thank you for your interest in GREAN WORLD's sustainable energy solutions. We are pleased to present our proposal for implementing solar power systems at your facility.

Our team has conducted a preliminary assessment based on the information you provided, and we believe we can help you reduce your energy costs by up to 40% while significantly decreasing your carbon footprint.

The proposed solution includes:
• Installation of 50kW solar panel array
• Smart energy management system
• Battery storage solution
• 24/7 monitoring and maintenance

We would be delighted to schedule a meeting to discuss this proposal in more detail. Please let me know your availability for next week.

Thank you for considering GREAN WORLD as your partner in sustainable energy.

Sincerely,`,
    signature: "",
    name: "Abebe Kebede",
    position: "Sales Director",
    department: "Business Development",
    phone: "+251 11 123 4567",
    email: "abebe.kebede@greanworld.et",
  })

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("letterheadContent", JSON.stringify(letterContent))
      localStorage.setItem("selectedTemplate", selectedTemplate)
    }, 2000)

    return () => clearTimeout(timer)
  }, [letterContent, selectedTemplate])

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("letterheadContent")
    const savedTemplate = localStorage.getItem("selectedTemplate")

    if (savedContent) {
      try {
        setLetterContent(JSON.parse(savedContent))
      } catch (error) {
        console.error("Error loading saved content:", error)
      }
    }

    if (savedTemplate) {
      setSelectedTemplate(savedTemplate as 'professional' | 'modern' | 'executive')
    }
  }, [])

  const letterheadRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (letterheadRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GREAN WORLD Letterhead</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none; }
              }
              body { font-family: Arial, sans-serif; }
              .letterhead-container {
                width: 21cm;
                min-height: 29.7cm;
                margin: 0 auto;
                background: white;
                position: relative;
              }
            </style>
          </head>
          <body>
            <div class="letterhead-container">
              ${letterheadRef.current.innerHTML}
            </div>
          </body>
        </html>
      `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const handleDownloadPDF = async () => {
    if (letterheadRef.current) {
      try {
        // Create a canvas from the letterhead content
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) return

        // Set canvas size for A4 (595 x 842 points at 72 DPI)
        canvas.width = 595
        canvas.height = 842

        // Fill white background
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Create a simple PDF-like download using HTML content
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>GREAN WORLD Letterhead</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: white;
                }
                .letterhead-container {
                  width: 100%;
                  max-width: 21cm;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              <div class="letterhead-container">
                ${letterheadRef.current.innerHTML}
              </div>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `

        const blob = new Blob([printContent], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "GREAN_WORLD_Letterhead.html"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        // Also offer browser print dialog
        setTimeout(() => {
          handlePrint()
        }, 500)
      } catch (error) {
        console.error("Error generating PDF:", error)
        // Fallback to print
        handlePrint()
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setLetterContent((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with brand typography */}
        <div className="mb-8">
          <h1 className={`typography-display text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            GREAN WORLD Letterhead Generator
          </h1>
          <p className={`typography-body text-lg ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            Create professional letterheads with official GREAN WORLD branding
          </p>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Edit Content
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GreanCard pattern="dots" gradient className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="date" className={isDarkMode ? "text-white" : "text-gray-900"}>
                      Date
                    </Label>
                    <Input
                      id="date"
                      value={letterContent.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipient" className={isDarkMode ? "text-white" : "text-gray-900"}>
                      Recipient
                    </Label>
                    <Textarea
                      id="recipient"
                      value={letterContent.recipient}
                      onChange={(e) => handleInputChange("recipient", e.target.value)}
                      rows={4}
                      className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className={isDarkMode ? "text-white" : "text-gray-900"}>
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={letterContent.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="body" className={isDarkMode ? "text-white" : "text-gray-900"}>
                      Letter Body
                    </Label>
                    <Textarea
                      id="body"
                      value={letterContent.body}
                      onChange={(e) => handleInputChange("body", e.target.value)}
                      rows={12}
                      className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={letterContent.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position" className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={letterContent.position}
                        onChange={(e) => handleInputChange("position", e.target.value)}
                        className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department" className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={letterContent.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={letterContent.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className={isDarkMode ? "text-white" : "text-gray-900"}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={letterContent.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signature" className={isDarkMode ? "text-white" : "text-gray-900"}>
                      Signature URL (optional)
                    </Label>
                    <Input
                      id="signature"
                      value={letterContent.signature}
                      onChange={(e) => handleInputChange("signature", e.target.value)}
                      placeholder="https://example.com/signature.png"
                      className={isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
                    />
                  </div>
                </div>
              </GreanCard>

              <div className="space-y-6">
                <GreanCard pattern="waves" gradient className="p-6">
                  <h3 className={`typography-h3 text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Actions</h3>
                  <div className="space-y-4">
                    <GreanButton
                      onClick={handlePrint}
                      variant="primary"
                      size="lg"
                      className="w-full flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Print Letterhead
                    </GreanButton>
                    <GreanButton
                      onClick={handleDownloadPDF}
                      variant="secondary"
                      size="lg"
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download as PDF
                    </GreanButton>
                    <GreanButton
                      onClick={() => {
                        localStorage.setItem("letterheadContent", JSON.stringify(letterContent))
                      }}
                      variant="outline"
                      size="md"
                      className="w-full flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </GreanButton>
                    <GreanButton
                      onClick={() => {
                        const saved = localStorage.getItem("letterheadContent")
                        if (saved) {
                          setLetterContent(JSON.parse(saved))
                        }
                      }}
                      variant="outline"
                      size="md"
                      className="w-full flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Load Draft
                    </GreanButton>
                  </div>
                </GreanCard>

                <GreanCard pattern="grid" className="p-6">
                  <h3 className={`typography-h3 text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Professional Tips</h3>
                  <ul className={`typography-body list-disc pl-5 space-y-2 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                    <li>Use clear, professional language</li>
                    <li>Include all necessary contact information</li>
                    <li>Keep paragraphs concise and focused</li>
                    <li>Use bullet points for lists</li>
                    <li>End with a clear call to action</li>
                    <li>Preview before printing or downloading</li>
                    <li>Auto-save keeps your work safe</li>
                    <li>Choose templates that match your purpose</li>
                  </ul>
                </GreanCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GreanCard
                pattern="dots"
                gradient={selectedTemplate === 'professional'}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  selectedTemplate === 'professional'
                    ? 'ring-2 ring-[#3DD56D] shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate('professional')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3DD56D] to-[#2bb757] rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`typography-h3 font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Professional
                  </h3>
                  <p className={`typography-body text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Clean, traditional layout perfect for formal business correspondence
                  </p>
                </div>
              </GreanCard>

              <GreanCard
                pattern="waves"
                gradient={selectedTemplate === 'modern'}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  selectedTemplate === 'modern'
                    ? 'ring-2 ring-[#3DD56D] shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate('modern')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2bb757] to-[#23A455] rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`typography-h3 font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Modern
                  </h3>
                  <p className={`typography-body text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Contemporary design with enhanced visual elements and patterns
                  </p>
                </div>
              </GreanCard>

              <GreanCard
                pattern="grid"
                gradient={selectedTemplate === 'executive'}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  selectedTemplate === 'executive'
                    ? 'ring-2 ring-[#3DD56D] shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate('executive')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#23A455] to-[#1e7e34] rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Layout className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`typography-h3 font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Executive
                  </h3>
                  <p className={`typography-body text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Premium layout with sophisticated styling for executive communications
                  </p>
                </div>
              </GreanCard>
            </div>

            <GreanCard pattern="radial" gradient className="p-6">
              <h3 className={`typography-h3 text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Template Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className={`typography-body font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Professional
                  </h4>
                  <ul className={`typography-small text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    <li>• Traditional header layout</li>
                    <li>• Clean typography</li>
                    <li>• Minimal visual elements</li>
                    <li>• Perfect for formal letters</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`typography-body font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Modern
                  </h4>
                  <ul className={`typography-small text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    <li>• Enhanced visual design</li>
                    <li>• Gradient accents</li>
                    <li>• Pattern backgrounds</li>
                    <li>• Contemporary styling</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`typography-body font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Executive
                  </h4>
                  <ul className={`typography-small text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    <li>• Premium layout design</li>
                    <li>• Sophisticated elements</li>
                    <li>• Enhanced branding</li>
                    <li>• Executive-level presentation</li>
                  </ul>
                </div>
              </div>
            </GreanCard>
          </TabsContent>

          <TabsContent value="preview">
            <div className="bg-white p-8 shadow-lg rounded-lg mb-6">
              <div
                ref={letterheadRef}
                className="w-full bg-white"
                style={{ minHeight: "29.7cm", width: "21cm", margin: "0 auto" }}
              >
                <LetterheadTemplate content={letterContent} template={selectedTemplate} />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <GreanButton
                onClick={handlePrint}
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Letterhead
              </GreanButton>
              <GreanButton
                onClick={handleDownloadPDF}
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download as PDF
              </GreanButton>
              <GreanButton
                onClick={() => copyToClipboard(letterheadRef.current?.innerHTML || '')}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy HTML
              </GreanButton>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface LetterheadTemplateProps {
  content: {
    date: string
    recipient: string
    subject: string
    body: string
    signature: string
    name: string
    position: string
    department: string
    phone: string
    email: string
  }
  template?: 'professional' | 'modern' | 'executive'
}

function LetterheadTemplate({ content, template = 'professional' }: LetterheadTemplateProps) {
  return (
    <div className="relative bg-white" style={{ width: "21cm", minHeight: "29.7cm", padding: "2.5cm 2cm" }}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center">
          {/* Official Logo */}
          <div className="mr-6">
            <Image
              src="/logos/grean-world-logo.png"
              alt="GREAN WORLD Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="typography-display text-3xl font-bold text-[#2bb757] tracking-wide">GREAN WORLD</h1>
            <p className="typography-body text-sm text-gray-600 font-medium">Sustainable Energy Solutions</p>
            <p className="typography-small text-xs text-gray-500 mt-1">Leading Ethiopia's Energy Transition</p>
          </div>
        </div>

        {/* Company Info Header */}
        <div className="text-right text-sm text-gray-600">
          <p className="typography-body font-semibold text-[#2bb757]">Head Office</p>
          <p className="typography-small">Bole Road, Addis Ababa</p>
          <p className="typography-small">Ethiopia</p>
          <p className="typography-small mt-2">📞 +251 11 123 4567</p>
          <p className="typography-small">✉️ info@greanworld.et</p>
        </div>
      </div>

      {/* Date Section */}
      <div className="text-right mb-12">
        <p className="text-gray-800 font-medium">{content.date}</p>
      </div>

      {/* Recipient Section */}
      <div className="mb-10">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#3DD56D]">
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">{content.recipient}</p>
        </div>
      </div>

      {/* Subject Section */}
      <div className="mb-8">
        <div className="border-b-2 border-[#3DD56D] pb-2">
          <p className="font-bold text-gray-900 text-lg">
            <span className="text-[#2bb757]">Re:</span> {content.subject}
          </p>
        </div>
      </div>

      {/* Body Section */}
      <div className="mb-12">
        <div className="text-gray-800 leading-relaxed space-y-4">
          {content.body.split("\n\n").map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Signature Section */}
      <div className="mb-8">
        {content.signature && (
          <div className="h-20 mb-4">
            <img
              src={content.signature || "/placeholder.svg"}
              alt="Signature"
              className="h-full object-contain object-left"
            />
          </div>
        )}
        <div className="border-l-4 border-[#3DD56D] pl-4">
          <p className="typography-h3 font-bold text-gray-900 text-lg">{content.name}</p>
          <p className="typography-body text-[#2bb757] font-semibold">{content.position}</p>
          <p className="typography-small text-gray-600 text-sm">{content.department}</p>
          <p className="typography-small text-gray-600 text-sm mt-1">GREAN WORLD</p>
          <div className="mt-3 space-y-1">
            <p className="typography-small text-gray-600 text-xs">📞 {content.phone}</p>
            <p className="typography-small text-gray-600 text-xs">✉️ {content.email}</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="flex justify-between items-end">
            <div className="text-sm text-gray-600">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 mr-3">
                  <Image
                    src="/logos/grean-world-logo.png"
                    alt="GREAN WORLD"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="typography-body font-bold text-[#2bb757]">GREAN WORLD</span>
              </div>
              <div className="ml-11 space-y-1">
                <p className="typography-small flex items-center">
                  <span className="w-4 h-4 mr-2">📍</span>
                  Bole Road, Addis Ababa, Ethiopia
                </p>
                <p className="typography-small flex items-center">
                  <span className="w-4 h-4 mr-2">📞</span>
                  +251 11 123 4567
                </p>
                <p className="typography-small flex items-center">
                  <span className="w-4 h-4 mr-2">✉️</span>
                  info@greanworld.et
                </p>
                <p className="typography-small flex items-center">
                  <span className="w-4 h-4 mr-2">🌐</span>
                  www.greanworld.et
                </p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#3DD56D] rounded-full flex items-center justify-center hover:bg-[#2bb757] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="w-8 h-8 bg-[#3DD56D] rounded-full flex items-center justify-center hover:bg-[#2bb757] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="w-8 h-8 bg-[#3DD56D] rounded-full flex items-center justify-center hover:bg-[#2bb757] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="2" y="9" width="4" height="12" stroke="white" strokeWidth="2" />
                  <circle cx="4" cy="4" r="2" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 opacity-10">
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 15L137.32 37.5L120 60L85.36 60L68.04 37.5L85.36 15L120 15Z" fill="#3DD56D" />
            <path d="M90 25L107.32 47.5L90 70L55.36 70L38.04 47.5L55.36 25L90 25Z" fill="#2bb757" fillOpacity="0.7" />
            <path d="M110 5L127.32 27.5L110 50L75.36 50L58.04 27.5L75.36 5L110 5Z" fill="#23A455" fillOpacity="0.5" />
            <path
              d="M80 35L97.32 57.5L80 80L45.36 80L28.04 57.5L45.36 35L80 35Z"
              stroke="#3DD56D"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
