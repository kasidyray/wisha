import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const MobileDialog = DialogPrimitive.Root

const MobileDialogTrigger = DialogPrimitive.Trigger

const MobileDialogClose = DialogPrimitive.Close

const MobileDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-white p-0 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
        "duration-200 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "inset-x-0 bottom-0 border-t rounded-t-[10px] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        "md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:rounded-lg md:border md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=closed]:slide-out-to-left-0 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:slide-in-from-left-0",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
MobileDialogContent.displayName = DialogPrimitive.Content.displayName

export { MobileDialog, MobileDialogTrigger, MobileDialogContent, MobileDialogClose } 