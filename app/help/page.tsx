"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is GitaAI?",
    answer: "GitaAI is an AI-powered platform that helps you explore and understand the Bhagavad Gita through intelligent search, chapter summaries, and interactive discussions. It combines traditional wisdom with modern technology to make the teachings more accessible."
  },
  {
    question: "How do I search through the Bhagavad Gita?",
    answer: "You can use the search bar at the top of the page to search for specific topics, verses, or concepts within the Bhagavad Gita. The search feature uses AI to understand context and provide relevant results."
  },
  {
    question: "Do I need an account to use GitaAI?",
    answer: "While you can browse chapters without an account, creating a free account gives you access to additional features like saving your favorite verses, tracking your reading progress, and participating in discussions."
  },
  {
    question: "How accurate are the translations and interpretations?",
    answer: "We source our translations from respected scholars and traditional sources. The AI-powered interpretations are meant to complement, not replace, traditional understanding. We recommend cross-referencing with multiple sources for deeper study."
  },
  {
    question: "Is GitaAI free to use?",
    answer: "Yes, GitaAI is currently free to use. We're committed to making spiritual wisdom accessible to everyone while maintaining high-quality service."
  },
  {
    question: "How can I report issues or suggest improvements?",
    answer: "You can contact us through our support email or use the feedback form in your profile section. We value user feedback and continuously work to improve the platform."
  },
  {
    question: "Can I download content for offline reading?",
    answer: "Currently, the content is available online only. We're working on adding offline reading capabilities in future updates."
  }
]

export default function HelpPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & FAQ</h1>
        <p className="text-gray-600">
          Find answers to common questions about GitaAI
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 p-6 bg-amber-50 rounded-lg">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">
          Need More Help?
        </h2>
        <p className="text-amber-700 mb-4">
          If you couldn't find the answer you were looking for, feel free to reach out to our support team.
        </p>
        <a
          href="mailto:support@gitaai.com"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
        >
          Contact Support →
        </a>
      </div>
    </div>
  )
}
