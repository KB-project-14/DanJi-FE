export type Role = 'ROLE_USER' | 'ROLE_ADMIN'

export interface MemberResponseDto {
    memberId: string
    username: string
    name: string
    role: Role
    createdAt: string
    updatedAt: string
  }