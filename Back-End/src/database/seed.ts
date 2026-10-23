import { db } from './db.js';
import { user, account, banners } from './schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';

export const criarAdminPadrao = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const adminEmail = process.env.ADMIN_EMAIL || (isProduction ? undefined : 'admin@email.com');
  const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? undefined : 'admin123');

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in production');
  }

  try {
    const adminExiste = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail));

    if (adminExiste.length > 0) {
      console.log(`Admin já existe: ${adminEmail}`);
      return;
    }

    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const senhaHash = await hashPassword(adminPassword);

    await db.insert(user).values({
      id: userId,
      name: 'Admin',
      email: adminEmail,
      papel: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(account).values({
      id: accountId,
      userId: userId,
      accountId: userId,
      providerId: 'credential',
      password: senhaHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Admin padrão criado com sucesso: ${adminEmail}`);
  } catch (err) {
    console.error('Erro ao criar admin:', err);
    throw err;
  }
};

export const criarBannersPadrao = async () => {
  const bannersPadrao = [
    {
      titulo: 'Banner Principal',
      imagemURL: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      ordem: 1,
      ativo: true,
    },
    {
      titulo: 'Banner Secundário',
      imagemURL: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      ordem: 2,
      ativo: true,
    },
    {
      titulo: 'Banner de Natureza',
      imagemURL: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
      ordem: 3,
      ativo: true,
    },
    {
      titulo: 'Banner de Artesanato',
      imagemURL: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9',
      ordem: 4,
      ativo: true,
    },
    {
      titulo: 'Banner de Decoração',
      imagemURL: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d',
      ordem: 5,
      ativo: true,
    },
    {
      titulo: 'Banner de Cerâmica',
      imagemURL: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa',
      ordem: 6,
      ativo: true,
    },
  ];

  try {
    const bannersExistentes = await db
      .select({ id: banners.id, titulo: banners.titulo })
      .from(banners);
    const titulosExistentes = new Set(
      bannersExistentes.map((banner) => banner.titulo),
    );
    const vagas = Math.max(0, 6 - bannersExistentes.length);
    const novosBanners = bannersPadrao
      .filter((banner) => !titulosExistentes.has(banner.titulo))
      .slice(0, vagas);

    if (novosBanners.length === 0) {
      console.log('Já existem seis banners ou mais');
      return;
    }

    await db.insert(banners).values(novosBanners);

    console.log(`${novosBanners.length} banners padrão criados com sucesso!`);
  } catch (err) {
    console.error('Erro ao criar banners:', err);
  }
};