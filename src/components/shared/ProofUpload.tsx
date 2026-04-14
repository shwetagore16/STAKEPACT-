import { useId, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud } from 'lucide-react'
import { cn } from '../../lib/utils'

type ProofUploadProps = {
  onUpload: (file: File) => void
  accept?: string
  label?: string
}

export default function ProofUpload({
  onUpload,
  accept = 'image/*,application/pdf',
  label = 'Drop your proof here or click to browse',
}: ProofUploadProps) {
  const inputId = useId()
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  const hintText = useMemo(() => {
    if (fileName) {
      return `Selected: ${fileName}`
    }
    return 'Supported: images, PDFs, and related proof documents'
  }, [fileName])

  const handleFile = (file: File | null) => {
    if (!file) return
    setFileName(file.name)
    onUpload(file)
  }

  return (
    <div className="w-full">
      <motion.label
        htmlFor={inputId}
        className={cn(
          'relative block cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-colors',
          'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] backdrop-blur-xl',
          dragActive ? 'border-[#00FFD1]/80 shadow-[0_0_0_1px_rgba(0,255,209,0.4),0_0_28px_rgba(0,255,209,0.2)]' : 'hover:border-white/25',
        )}
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragActive(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragActive(false)
          const droppedFile = event.dataTransfer.files?.[0] ?? null
          handleFile(droppedFile)
        }}
        animate={{ scale: dragActive ? 1.01 : 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null
            handleFile(selectedFile)
          }}
        />

        <div className="mx-auto flex max-w-xl flex-col items-center gap-2">
          <UploadCloud className="h-7 w-7 text-[#00FFD1]" />
          <p className="font-syne text-base text-white">{label}</p>
          <p className="text-sm text-white/55">{hintText}</p>
        </div>
      </motion.label>
    </div>
  )
}
