export type Roles = "admin" | 'super_admin' | 'user'

export const USER_ROLE = {
    admin : "admin",
    super_admin : "super_admin",
    user : "user"
} as const;