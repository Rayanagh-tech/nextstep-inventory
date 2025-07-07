export interface Tag {
    id: number;
    name: string;
    type: string;
    description?: string;
    count: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    color?: string; // optional if needed for visual tags


  }
  