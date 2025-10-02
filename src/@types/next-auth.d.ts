// eslint-disable-next-line sonarjs/unused-import, @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatarUrl: string
  }

  interface Session {
    user: User
  }
}
