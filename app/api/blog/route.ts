import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/lib/schemas/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const tag = searchParams.get('tag');
    const author = searchParams.get('author');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (published === 'true') {
      query.isPublished = true;
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    if (author) {
      query.author = new RegExp(author, 'i');
    }
    
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await BlogPost.countDocuments(query);
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      heroImage,
      author,
      tags = [],
      isPublished = false,
      publishedAt
    } = body;
    
    // Validate required fields
    if (!title || !slug || !excerpt || !content || !heroImage || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }
    
    const post = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      heroImage,
      author,
      tags,
      isPublished,
      publishedAt: publishedAt ? new Date(publishedAt) : null
    });
    
    const savedPost = await post.save();
    
    return NextResponse.json(savedPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
