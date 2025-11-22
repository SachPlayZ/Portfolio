export interface Project {
  _id: string;
  name?: string;
  logo?: string;
  overview?: string;
  description?: string;
  images?: string[];
  demoVideoEmbed?: string;
  techStack?: string[];
  links?: { name?: string; url?: string }[];
}

