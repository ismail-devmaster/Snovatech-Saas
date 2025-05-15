"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const modalVariants = cva("fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6", {
  variants: {
    position: {
      default: "items-center justify-center",
      top: "items-start justify-center",
      bottom: "items-end justify-center",
      left: "items-center justify-start",
      right: "items-center justify-end",
    },
  },
  defaultVariants: {
    position: "default",
  },
})

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalVariants> {
  open?: boolean
  onClose?: () => void
  children: React.ReactNode
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, position, open, onClose, children, ...props }, ref) => {
    // Handle ESC key press
    React.useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape" && onClose) {
          onClose()
        }
      }
      window.addEventListener("keydown", handleEsc)
      return () => {
        window.removeEventListener("keydown", handleEsc)
      }
    }, [onClose])

    // Prevent body scroll when modal is open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
      return () => {
        document.body.style.overflow = "auto"
      }
    }, [open])

    if (!open) return null

    return (
      <div className={cn(modalVariants({ position }), className)} ref={ref} {...props}>
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    )
  },
)
Modal.displayName = "Modal"

export { Modal }
