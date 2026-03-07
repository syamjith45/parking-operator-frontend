import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Modal = ({ isOpen, onClose, title, children, className, footer }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    />
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className={cn(
                                "w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl shadow-slate-900/20",
                                className
                            )}
                        >
                            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-4 sm:py-5 bg-slate-50/50">
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
                               <button
  onClick={onClose}
  className="flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
>
  <X className="h-4 w-4" />
</button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">{children}</div>
                            {footer && (
                                <div className="flex-shrink-0 px-4 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export { Modal }
