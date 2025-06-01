"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const modalVariants = cva("fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6", {
  variants: {
    position: {
      default: "items-center justify-center",
      top: "items-start justify-center pt-20",
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
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-all duration-300"
          onClick={onClose}
        />

        {/* Modal container */}
        <div className={cn(modalVariants({ position }), className)} ref={ref} {...props}>
          <div className="relative z-[100] max-h-[95vh] max-w-[95vw] w-full overflow-hidden rounded-2xl bg-white shadow-2xl transform transition-all duration-300 ease-out">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="overflow-y-auto max-h-[95vh]">{children}</div>
          </div>
        </div>
      </>
    )
  },
)
Modal.displayName = "Modal"

export { Modal }
