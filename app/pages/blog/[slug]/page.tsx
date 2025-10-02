import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "../../../components/Navigation";
import { getPlaceById } from "../../../data/places";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getPlaceById(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-700">
            <div className="mb-2 sm:mb-0">
              <p className="text-base sm:text-lg text-gray-700">📍 {post.location}</p>
              <p className="text-sm text-gray-600">{post.address}</p>
            </div>
            <p className="text-sm text-gray-600">
              📅 {new Date(post.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.images[0]}
              alt={post.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 sm:mb-8">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 sm:mb-6 text-gray-700 leading-relaxed text-sm sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <a
            href="/pages/lugares"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← Volver a Lugares
          </a>
        </div>
      </div>
    </div>
  );
}
