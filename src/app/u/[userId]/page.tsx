"use client";

import { useParams } from "next/navigation";
import { usePublicProfile } from "@/features/profiles/api/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  AlertCircleIcon, 
  Location01Icon, 
  Link01Icon, 
  UserCircleIcon,
  Briefcase01Icon,
  BookOpen01Icon,
  Certificate01Icon,
  Rocket01Icon,
  Settings02Icon,
  LanguageCircleIcon,
  LockPasswordIcon
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: profile, isLoading, isError, error } = usePublicProfile(userId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background p-4 sm:p-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Failed to load profile</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          {error?.message || "An unexpected error occurred while loading the profile."}
        </p>
      </div>
    );
  }

  if (!profile) return null;

  if (profile.is_private) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center bg-background">
        <div className="size-24 rounded-full bg-muted border-4 border-background shadow-sm flex items-center justify-center text-muted-foreground mb-6">
          <HugeiconsIcon icon={LockPasswordIcon} className="size-10" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">This profile is private</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          {profile.name ? `${profile.name} has` : "This user has"} chosen to keep their profile information private.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-6">
          
          {/* Header */}
          <Card className="overflow-hidden border-border bg-card shadow-sm">
            <div className="h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent relative" />
            <CardContent className="px-6 sm:px-8 pb-8 relative pt-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="size-24 sm:size-32 border-4 border-white shadow-md bg-background -mt-12 sm:-mt-16 ring-1 ring-border">
                  {profile.image && <AvatarImage src={profile.image} alt={profile.name || "User"} />}
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {profile.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 mt-2">
                  <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                  {profile.headline && (
                    <p className="text-lg text-muted-foreground mt-1 font-medium">{profile.headline}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Location01Icon} className="size-4" />
                      Remote / Anywhere
                    </span>
                    {profile.portfolio_url && (
                      <a 
                        href={profile.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <HugeiconsIcon icon={Link01Icon} className="size-4" />
                        Portfolio
                      </a>
                    )}
                    <Badge variant="default" className="ml-auto">
                      Open to Work
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              
              {/* About */}
              {profile.about && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-primary" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                      {profile.about}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {profile.experience?.length > 0 && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={Briefcase01Icon} className="size-5 text-primary" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.experience.map((exp: Record<string, unknown>) => (
                      <div key={exp.id} className="relative pl-6 before:absolute before:left-1.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden">
                        <div className="absolute left-0 top-1.5 size-3.5 rounded-full bg-primary/20 border-2 border-primary" />
                        <h4 className="text-base font-semibold">{exp.title}</h4>
                        <div className="text-sm text-muted-foreground mt-0.5 mb-2">
                          <span className="font-medium text-foreground">{exp.company}</span>
                          <span className="mx-1.5">•</span>
                          {exp.start_date ? new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ""} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "Present"}
                          {exp.location && (
                            <>
                              <span className="mx-1.5">•</span>
                              {exp.location}
                            </>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {profile.education?.length > 0 && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={BookOpen01Icon} className="size-5 text-primary" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.education.map((edu: Record<string, unknown>) => (
                      <div key={edu.id} className="relative pl-6 before:absolute before:left-1.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden">
                        <div className="absolute left-0 top-1.5 size-3.5 rounded-full bg-primary/20 border-2 border-primary" />
                        <h4 className="text-base font-semibold">{edu.institution}</h4>
                        <div className="text-sm text-muted-foreground mt-0.5 mb-2">
                          <span className="font-medium text-foreground">{edu.degree}</span>
                          {edu.field_of_study && <>, {edu.field_of_study}</>}
                          <span className="mx-1.5">•</span>
                          {edu.start_date ? new Date(edu.start_date).getFullYear() : ""} - {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                        </div>
                        {edu.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {profile.projects?.length > 0 && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={Rocket01Icon} className="size-5 text-primary" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    {profile.projects.map((proj: Record<string, unknown>) => (
                      <div key={proj.id} className="border border-border rounded-lg p-4 bg-muted/20">
                        <h4 className="font-semibold text-base">{proj.title}</h4>
                        <div className="text-xs text-muted-foreground mt-1 mb-2">
                          {proj.start_date && new Date(proj.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </div>
                        {proj.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{proj.description}</p>
                        )}
                        <div className="flex gap-3 text-sm">
                          {proj.live_url && (
                            <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Live Demo
                            </a>
                          )}
                          {proj.repository_url && (
                            <a href={proj.repository_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Repository
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {profile.certifications?.length > 0 && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={Certificate01Icon} className="size-5 text-primary" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.certifications.map((cert: Record<string, unknown>) => (
                      <div key={cert.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="size-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <HugeiconsIcon icon={Certificate01Icon} className="size-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                            {cert.issue_date && <span>Issued: {new Date(cert.issue_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>}
                            {cert.credential_url && (
                              <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                View Credential
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>

            <div className="space-y-6">
              {/* Skills */}
              {profile.skills?.length > 0 && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={Settings02Icon} className="size-5 text-primary" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: Record<string, unknown>) => (
                        <Badge key={skill.skill_id} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary hover:bg-primary/10 border-none">
                          {skill.skill_name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {profile.languages?.length > 0 && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={LanguageCircleIcon} className="size-5 text-primary" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.languages.map((lang: Record<string, unknown>) => (
                      <div key={lang.language_id} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-foreground">{lang.language_name}</span>
                        {lang.proficiency && (
                          <span className="text-muted-foreground capitalize">{lang.proficiency}</span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
