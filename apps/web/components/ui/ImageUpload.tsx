'use client'

import React, { useState, useRef } from 'react'
import { Camera, X, Loader2, ImagePlus } from 'lucide-react'
import { api } from '@/lib/api'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onRemove?: (url: string) => void
  images: string[]
  maxImages?: number
  circular?: boolean
  label?: string
}

export default function ImageUpload({
  onUpload,
  onRemove,
  images,
  maxImages = 4,
  circular = false,
  label = 'Add photo',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await api.uploadListingImage(file)
      onUpload(result.url)
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  if (circular) {
    // Avatar upload mode
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: '88px', height: '88px',
            borderRadius: '50%',
            background: images[0] ? 'transparent' : 'var(--green-pale)',
            border: '3px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(26,21,16,0.12)',
          }}
        >
          {images[0] ? (
            <img src={images[0]} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : uploading ? (
            <Loader2 size={24} color="var(--green)" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Camera size={28} color="var(--green)" strokeWidth={1.5} />
          )}
        </div>
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: '28px', height: '28px',
          background: 'var(--green)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid white', cursor: 'pointer',
        }}
          onClick={() => inputRef.current?.click()}
        >
          <Camera size={13} color="white" strokeWidth={2.5} />
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    )
  }

  // Grid upload mode for listings
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {images.map((url, i) => (
          <div key={url} style={{
            width: '80px', height: '80px',
            borderRadius: '12px', overflow: 'hidden',
            position: 'relative', flexShrink: 0,
            border: '1px solid var(--border)',
          }}>
            <img src={url} alt={`Image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {onRemove && (
              <button
                onClick={() => onRemove(url)}
                style={{
                  position: 'absolute', top: '3px', right: '3px',
                  width: '20px', height: '20px',
                  background: 'rgba(26,21,16,0.7)', borderRadius: '50%',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={11} color="white" strokeWidth={2.5} />
              </button>
            )}
            {i === 0 && (
              <div style={{
                position: 'absolute', bottom: '3px', left: '3px',
                background: 'rgba(26,21,16,0.65)', borderRadius: '4px',
                padding: '1px 5px', fontSize: '9px', color: 'white', fontWeight: 700,
              }}>
                MAIN
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            style={{
              width: '80px', height: '80px',
              borderRadius: '12px',
              border: '1.5px dashed var(--border)',
              background: 'var(--cream)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', cursor: uploading ? 'not-allowed' : 'pointer',
              color: 'var(--muted)', flexShrink: 0,
            }}
          >
            {uploading ? (
              <Loader2 size={20} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <ImagePlus size={20} strokeWidth={1.5} />
                <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {label}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
        {images.length}/{maxImages} photos · First photo is the main image · Max 5MB each
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}