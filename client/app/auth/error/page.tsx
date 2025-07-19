"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'Access was denied. Please try again.',
    Verification: 'The verification token has expired or has already been used.',
    OAuthSignin: 'Error in constructing an authorization URL.',
    OAuthCallback: 'Error in handling the response from the OAuth provider.',
    OAuthCreateAccount: 'Could not create OAuth account in the database.',
    EmailCreateAccount: 'Could not create email account in the database.',
    Callback: 'Error in the OAuth callback handler route.',
    OAuthAccountNotLinked: 'Account is linked to another provider.',
    EmailSignin: 'Sending the email with the verification token failed.',
    CredentialsSignin: 'The credentials you provided are incorrect.',
    SessionRequired: 'You must be signed in to access this page.',
    default: 'An unknown error occurred during authentication.',
  }

  const errorMessage = errorMessages[error || ''] || errorMessages.default

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#0f3460]/20 border-[#0f3460]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-[#e94560]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#f9f9f9]">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-[#f9f9f9]/70">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full bg-[#e94560] hover:bg-[#d63851]">
            <Link href="/auth/signin">
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-[#16213e] text-[#f9f9f9]">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 