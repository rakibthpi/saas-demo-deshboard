"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Download, ExternalLink, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { billingService, Plan, Invoice } from "@/lib/services/billing-service"

export default function BillingPage() {
  const [isYearly, setIsYearly] = React.useState(false)
  const [plans, setPlans] = React.useState<Plan[]>([])
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [paymentMethod, setPaymentMethod] = React.useState<{type: string, last4: string, expiry: string} | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      const [plansData, invoicesData, pmData] = await Promise.all([
        billingService.getPlans(),
        billingService.getInvoices(),
        billingService.getPaymentMethod()
      ])
      setPlans(plansData)
      setInvoices(invoicesData)
      setPaymentMethod(pmData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground font-medium">Loading billing data...</div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription, payment methods and billing history.</p>
        </div>

        <div className="flex justify-center">
          <div className="bg-muted p-1 rounded-full flex gap-1">
            <Button 
              variant={!isYearly ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full px-6"
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </Button>
            <Button 
              variant={isYearly ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full px-6"
              onClick={() => setIsYearly(true)}
            >
              Yearly
              <span className="ml-1.5 text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold uppercase">
                -20%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "relative flex flex-col border-none shadow-xl glass-card h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group",
                  plan.popular && "ring-2 ring-primary z-10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    {plan.name}
                    {plan.popular && <Zap className="h-4 w-4 text-primary fill-primary" />}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-baseline gap-1 mb-6">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={isYearly ? "yearly" : "monthly"}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="text-4xl font-bold"
                      >
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-muted-foreground text-sm">/{isYearly ? "year" : "month"}</span>
                  </div>
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={cn(
                      "w-full font-bold transition-all",
                      plan.popular && "shadow-lg shadow-primary/20"
                    )}
                    variant={plan.name === "Free" ? "outline" : "default"}
                    disabled={plan.name === "Free"}
                  >
                    {plan.name === "Free" ? "Current Plan" : 
                     plan.name === "Enterprise" ? "Contact Sales" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Update your billing details and card information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-14 bg-accent flex items-center justify-center rounded-md border text-muted-foreground">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{paymentMethod?.type} ending in {paymentMethod?.last4}</p>
                    <p className="text-xs text-muted-foreground">Expires {paymentMethod?.expiry}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/5 p-4 flex justify-between items-center">
              <span className="text-xs text-muted-foreground italic">Powered by Stripe</span>
              <Button variant="link" size="sm" className="gap-1.5 h-auto p-0">
                Manage in Stripe <ExternalLink className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your recent invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between group">
                    <div>
                      <p className="font-medium text-sm">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold">{invoice.amount}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/5 p-4">
              <Button variant="ghost" className="w-full text-xs h-8">View all invoices</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

