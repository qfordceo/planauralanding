export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  completed_date: string;
  image_url: string;
}

export interface FormData {
  title: string;
  description: string;
  completed_date: string;
  image?: File;
}