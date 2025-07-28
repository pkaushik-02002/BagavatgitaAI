"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
      
      <Card className="p-6 space-y-6 mb-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
          <p className="text-gray-600">
            Welcome to GitaAI. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>"Service" refers to GitaAI&apos;s website and AI-powered Bhagavad Gita exploration platform.</li>
            <li>"User" refers to any individual accessing or using our Service.</li>
            <li>"Content" refers to text, images, audio, video, or other material available through the Service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">3. Use of Service</h2>
          <p className="text-gray-600">
            You agree to use our Service only for lawful purposes and in accordance with these Terms. You must not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Use the Service in any way that violates applicable laws or regulations</li>
            <li>Attempt to interfere with or disrupt the Service</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use the Service for commercial purposes without our express consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">4. Account Registration</h2>
          <p className="text-gray-600">
            To access certain features, you may need to register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">5. Intellectual Property</h2>
          <p className="text-gray-600">
            The Service and its original content (excluding Content provided by users) are and will remain the exclusive property of GitaAI. The Service is protected by copyright, trademark, and other laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">6. User Content</h2>
          <p className="text-gray-600">
            By posting Content to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">7. Termination</h2>
          <p className="text-gray-600">
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">8. Limitation of Liability</h2>
          <p className="text-gray-600">
            To the maximum extent permitted by law, GitaAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">9. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">10. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at{" "}
            <Link href="mailto:support@gitaai.com" className="text-amber-600 hover:text-amber-700">
              support@gitaai.com
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
