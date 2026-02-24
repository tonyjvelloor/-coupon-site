import { cookies } from 'next/headers';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

const SESSION_NAME = 'admin_session';

export async function createSession(email: string, password: string) {
    console.log("🔐 createSession called for:", email);

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        console.log("🔐 Admin found:", !!admin);

        if (!admin) {
            return { error: 'Invalid credentials' };
        }

        const isValid = await bcrypt.compare(password, admin.password);
        console.log("🔐 Password valid:", isValid);

        if (!isValid) {
            return { error: 'Invalid credentials' };
        }

        // Create a simple session token
        const sessionToken = Buffer.from(JSON.stringify({
            id: admin.id,
            email: admin.email,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        })).toString('base64');

        console.log("🔐 Setting cookie...");
        const cookieStore = await cookies();
        cookieStore.set(SESSION_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });
        console.log("🔐 Cookie set successfully");

        return { success: true, admin: { id: admin.id, email: admin.email, name: admin.name } };
    } catch (err) {
        console.error("❌ createSession internal error:", err);
        throw err;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_NAME)?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

        if (decoded.exp < Date.now()) {
            return null;
        }

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true },
        });

        return admin;
    } catch {
        return null;
    }
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_NAME);
}

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12);
}
