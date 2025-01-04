export interface GuideSection {
  title: string;
  items: string[];
}

export interface Guide {
  id?: string;
  title: string;
  guide_type: string;
  content: {
    sections: GuideSection[];
  };
  change_summary: string;
  is_published: boolean;
}