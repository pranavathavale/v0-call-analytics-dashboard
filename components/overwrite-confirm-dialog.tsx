"use client"

import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DataPoint {
  hour: string
  responseTime: number
}

interface OverwriteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  previousValues: DataPoint[]
  newValues: DataPoint[]
  onConfirm: () => void
}

export function OverwriteConfirmDialog({
  open,
  onOpenChange,
  previousValues,
  newValues,
  onConfirm,
}: OverwriteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Overwrite Existing Data?
          </DialogTitle>
          <DialogDescription className="text-pretty">
            You have previously saved data. Are you sure you want to overwrite it with new values?
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Previous Values</h4>
            <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-1 max-h-48 overflow-y-auto">
              {previousValues.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.hour}:</span>
                  <span className="font-medium">{item.responseTime}s</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">New Values</h4>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1 max-h-48 overflow-y-auto">
              {newValues.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.hour}:</span>
                  <span className="font-medium text-primary">{item.responseTime}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Yes, Overwrite Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
