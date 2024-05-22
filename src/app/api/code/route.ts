// app/api/push-code/route.js

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import simpleGit from 'simple-git'

const git = simpleGit()

export async function POST(request: Request) {
  const body = await request.json()
  const { code, filePath } = body

  if (!code || !filePath) {
    return NextResponse.json({ message: 'Missing code or filePath in request body' }, { status: 400 })
  }

  try {
    const fullFilePath = path.join(process.cwd(), filePath)
    await fs.writeFile(fullFilePath, code, 'utf8')

    await git.add(fullFilePath)
    await git.commit(`Update ${filePath}`)
    await git.push('origin', 'master') // Ensure 'main' is the correct branch

    return NextResponse.json({ message: 'File pushed to GitHub successfully!' }, { status: 200 })
  } catch (error) {
    console.error('Failed to push file to GitHub:', error)
    return NextResponse.json({ message: 'Failed to push file to GitHub', error }, { status: 500 })
  }
}
