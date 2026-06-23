import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-destructive">Access Denied</CardTitle>
          <CardDescription className="text-base mt-2">
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            If you believe this is an error, please contact support or try logging in with an account that has the required permissions.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button render={<Link href="/" />} variant="outline">
              Return Home
            </Button>
            <Button render={<Link href="/login" />}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
