import mongoose, { Schema, Document } from 'mongoose'

export interface IAdminVault extends Document {
     resumeId: mongoose.Types.ObjectId
     approvedCareerPath: string
     adminNotes: string
     skillGapSummary: string[]
     status: 'approved' | 'rejected' | 'needs_review'
     createdAt: Date
}

const AdminVaultSchema = new Schema<IAdminVault>(
     {
          resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
          approvedCareerPath: { type: String, required: true },
          adminNotes: { type: String, default: '' },
          skillGapSummary: [String],
          status: { type: String, enum: ['approved', 'rejected', 'needs_review'], default: 'approved' },
     },
     { timestamps: true }
)

export const AdminVault = mongoose.model<IAdminVault>('AdminVault', AdminVaultSchema)