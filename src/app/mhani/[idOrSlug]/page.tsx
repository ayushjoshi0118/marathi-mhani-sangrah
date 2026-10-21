import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getProverbByIdOrSlug,
  getRelatedProverbs,
  getAllProverbs,
} from '@/data/storage';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbDetailView from '@/components/proverbs/ProverbDetailView';

interface ProverbPageProps {
  params: Promise<{
    idOrSlug: string;
  }>;
}

export async function generateMetadata({ params }: ProverbPageProps): Promise<Metadata> {
  const { idOrSlug } = await params;
  const proverb = getProverbByIdOrSlug(idOrSlug);

  if (!proverb) {
    return {
      title: 'म्हण सापडली नाही | मराठी म्हणी संग्रह',
    };
  }

  const serialDevanagari = toMarathiNumerals(proverb.serialNumber);
  const title = `म्हण #${serialDevanagari}: "${proverb.proverb}" — अर्थ, उदाहरण व संदर्भ`;
  const description = `मराठी म्हण #${proverb.serialNumber} — "${proverb.proverb}": ${proverb.meaningMarathi}. दैनंदिन जीवनातील उदाहरण: "${proverb.exampleMarathi}".`;

  return {
    title,
    description,
    keywords: [
      proverb.proverb,
      `${proverb.proverb} अर्थ`,
      `${proverb.proverb} वाक्य`,
      proverb.category,
      ...proverb.tags,
      `मराठी म्हण ${proverb.serialNumber}`,
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://marathimhani.org/mhani/${proverb.serialNumber}`,
      locale: 'mr_IN',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://marathimhani.org/mhani/${proverb.serialNumber}`,
    },
  };
}

export async function generateStaticParams() {
  const proverbs = getAllProverbs();
  // Pre-generate popular top 50 static paths, rest ISR rendered
  return proverbs.slice(0, 50).map((p) => ({
    idOrSlug: p.serialNumber.toString(),
  }));
}

export default async function ProverbDetailPage({ params }: ProverbPageProps) {
  const { idOrSlug } = await params;
  const proverb = getProverbByIdOrSlug(idOrSlug);

  if (!proverb) {
    notFound();
  }

  const related = getRelatedProverbs(proverb, 4);

  const prevSerial = proverb.serialNumber > 1 ? proverb.serialNumber - 1 : null;
  const nextSerial = proverb.serialNumber < 1000 ? proverb.serialNumber + 1 : null;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: proverb.proverb,
    termCode: proverb.serialNumber.toString(),
    description: proverb.meaningMarathi,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'मराठी म्हणी संग्रह (Marathi Mhani Sangrah)',
      url: 'https://marathimhani.org/mhani',
    },
    alternateName: proverb.englishEquivalent || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProverbDetailView
        proverb={proverb}
        relatedProverbs={related}
        prevSerial={prevSerial}
        nextSerial={nextSerial}
      />
    </>
  );
}
