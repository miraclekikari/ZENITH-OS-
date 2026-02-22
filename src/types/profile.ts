export interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string;
    created_at: string;
  }
  
  export interface Post {
    id: string;
    user_id: string;
    content: string;
    image_url: string;
    created_at: string;
    likes_count?: number;
    comments_count?: number;
    profiles: Profile;
  }
  