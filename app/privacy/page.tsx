"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <Card className="p-6 space-y-6 mb-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
          <p className="text-gray-600">
            At GitaAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">2. Information We Collect</h2>
          <h3 className="text-xl font-medium text-gray-700 mt-4">2.1 Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Name and email address when you create an account</li>
            <li>Profile information you provide</li>
            <li>Authentication data when you sign in with third-party services</li>
            <li>Your interactions and conversations with our AI service</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-700 mt-4">2.2 Usage Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information</li>
            <li>Usage patterns and preferences</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">3. How We Use Your Information</h2>
          <p className="text-gray-600">We use the collected information for:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Providing and maintaining our Service</li>
            <li>Personalizing your experience</li>
            <li>Improving our AI responses and recommendations</li>
            <li>Communicating with you about updates and changes</li>
            <li>Analyzing usage patterns to improve our Service</li>
            <li>Detecting and preventing fraud or abuse</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">4. Information Sharing</h2>
          <p className="text-gray-600">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Service providers who assist in operating our website</li>
            <li>Analytics partners</li>
            <li>Law enforcement when required by law</li>
            <li>Third parties in the event of a business transaction (e.g., merger or acquisition)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">5. Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">6. Your Rights</h2>
          <p className="text-gray-600">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Request data portability</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">7. Cookies</h2>
          <p className="text-gray-600">
            We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">8. Children&apos;s Privacy</h2>
          <p className="text-gray-600">
            Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and discover that your child has provided us with personal information, please contact us to have it removed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">9. Changes to Privacy Policy</h2>
          <p className="text-gray-600">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">10. Contact Us</h2>
          <p className="text-gray-600">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <Link href="mailto:privacy@gitaai.com" className="text-amber-600 hover:text-amber-700">
              privacy@gitaai.com
            </Link>
          </p>
        </section>
      </Card>

      <div className="text-center text-sm text-gray-600">
        Last updated: July 28, 2025
      </div>
    </div>
  )
}
