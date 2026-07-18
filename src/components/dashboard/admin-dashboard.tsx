"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Building01Icon, MenuIcon, Cancel01Icon, UserGroupIcon, 
  Shield01Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState } from "@/components/common/loading-state";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";

import { useAdminUsers, useAuditLogs } from "@/features/admin/api/queries";
import { useUpdateUserRole, useUpdateUserStatus, useVerifyCompany } from "@/features/admin/api/mutations";
import { useCompanies } from "@/features/companies/api/queries";

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Queries
  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers({ limit: 50, page: 1 });
  const { data: auditData, isLoading: isLoadingAudit } = useAuditLogs({ limit: 50, page: 1 });
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies({ limit: 50, page: 1 });

  // Mutations
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  const verifyCompanyMutation = useVerifyCompany();

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "candidate" : currentRole === "recruiter" ? "admin" : "recruiter";
    try {
      await updateRoleMutation.mutateAsync({ userId, data: { role: newRole as "admin" | "candidate" | "recruiter" } });
      toast.success("User role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleStatusToggle = async (userId: string, isBanned: boolean) => {
    try {
      await updateStatusMutation.mutateAsync({ userId, data: { banned: !isBanned, banReason: !isBanned ? "Admin decision" : undefined } });
      toast.success(`User ${isBanned ? 'unbanned' : 'banned'}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleVerifyCompany = async (companyId: string, isVerified: boolean) => {
    try {
      await verifyCompanyMutation.mutateAsync({ companyId, data: { is_verified: !isVerified } });
      toast.success(`Company ${!isVerified ? 'verified' : 'unverified'}`);
    } catch {
      toast.error("Failed to verify company");
    }
  };

  const adminStats = [
    { label: "Total Users", value: usersData?.pagination.total || 0, icon: UserGroupIcon, color: "text-primary" },
    { label: "Total Companies", value: companiesData?.pagination.total || 0, icon: Building01Icon, color: "text-indigo-600" },
    { label: "Audit Events", value: auditData?.pagination.total || 0, icon: Shield01Icon, color: "text-emerald-600" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/logo.svg"
              alt="CareerBridge Logo"
              width={80}
              height={80}
              priority
              className="h-20 w-20 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">CareerBridge</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <span className="text-sm font-semibold text-primary">Admin Control Center</span>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
              <HugeiconsIcon icon={Shield01Icon} className="size-4" />
              <span>Super Admin</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : MenuIcon} className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div
          className="rounded-3xl border border-destructive/10 bg-linear-to-r from-destructive/10 to-destructive/5 p-6 sm:p-8 mb-8"
          style={{
            backgroundImage: `radial-gradient(var(--color-destructive) 1px, transparent 1px), linear-gradient(to right, var(--color-destructive), var(--color-destructive))`,
            backgroundSize: "24px 24px, 100% 100%",
            backgroundBlendMode: "overlay"
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                System Administration
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Manage platform users, verify companies, and monitor audit logs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
          {adminStats.map((stat) => (
            <Card key={stat.label} className="bg-card border border-border shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{isLoadingUsers ? "-" : stat.value}</p>
                </div>
                <div className={`size-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <HugeiconsIcon icon={stat.icon} className="size-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 bg-card border border-border shadow-sm rounded-xl p-1">
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User Management</TabsTrigger>
            <TabsTrigger value="companies" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Company Verification</TabsTrigger>
            <TabsTrigger value="audit" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Audit Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-card border border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingUsers ? (
                        <TableRow><TableCell colSpan={4}><LoadingState type="table" count={5} /></TableCell></TableRow>
                      ) : usersData?.users.length === 0 ? (
                        <TableRow><TableCell colSpan={4}><Empty><EmptyTitle>No users found</EmptyTitle><EmptyDescription>There are currently no users in the system.</EmptyDescription></Empty></TableCell></TableRow>
                      ) : usersData?.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                {user.name.substring(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={!user.banned ? 'secondary' : 'destructive'} className={!user.banned ? 'bg-emerald-500/10 text-emerald-600' : ''}>
                              {!user.banned ? 'Active' : 'Banned'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" size="sm" className="h-8 text-xs"
                              onClick={() => handleRoleChange(user.id, user.role)}
                              disabled={updateRoleMutation.isPending}
                            >
                              Cycle Role
                            </Button>
                            <Button 
                              variant={!user.banned ? 'destructive' : 'default'} size="sm" className="h-8 text-xs"
                              onClick={() => handleStatusToggle(user.id, user.banned)}
                              disabled={updateStatusMutation.isPending || user.role === 'admin'}
                            >
                              {!user.banned ? 'Ban' : 'Unban'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card className="bg-card border border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Verification Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingCompanies ? (
                        <TableRow><TableCell colSpan={4}><LoadingState type="table" count={5} /></TableCell></TableRow>
                      ) : companiesData?.companies.length === 0 ? (
                        <TableRow><TableCell colSpan={4}><Empty><EmptyTitle>No companies found</EmptyTitle><EmptyDescription>There are currently no companies registered.</EmptyDescription></Empty></TableCell></TableRow>
                      ) : companiesData?.companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
                                <HugeiconsIcon icon={Building01Icon} className="size-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{company.name}</p>
                                <p className="text-xs text-muted-foreground">{company.website || "No website"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{company.industry}</TableCell>
                          <TableCell>
                            {company.is_verified ? (
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant={company.is_verified ? 'outline' : 'default'} size="sm" className="h-8 text-xs"
                              onClick={() => handleVerifyCompany(company.id, company.is_verified)}
                              disabled={verifyCompanyMutation.isPending}
                            >
                              {company.is_verified ? 'Revoke Verification' : 'Verify Company'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card className="bg-card border border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Actor ID</TableHead>
                        <TableHead>Target</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingAudit ? (
                        <TableRow><TableCell colSpan={4}><LoadingState type="table" count={5} /></TableCell></TableRow>
                      ) : auditData?.logs.length === 0 ? (
                        <TableRow><TableCell colSpan={4}><Empty><EmptyTitle>No logs found</EmptyTitle><EmptyDescription>There are currently no audit logs.</EmptyDescription></Empty></TableCell></TableRow>
                      ) : auditData?.logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                            {formatDistanceToNow(parseISO(log.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-muted text-foreground">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{log.actor_id.substring(0, 8)}...</TableCell>
                          <TableCell>
                            <span className="text-xs font-medium uppercase text-muted-foreground mr-1">{log.target_type}:</span>
                            <span className="font-mono text-xs">{log.target_id.substring(0, 8)}...</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
