export enum TemplateId {
  BASIC = 'BASIC',
  STORYTELLING = 'STORYTELLING',
  EDITABLE = 'EDITABLE',
  UNIVERSAL = 'UNIVERSAL',
  IMAGE_EDITING = 'IMAGE_EDITING',
}

export interface SlideContent {
  title: string;
  content: string;
  visualSuggestion: string;
  emojis: string;
}

export type CarouselData = SlideContent[];

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'file';
    placeholder: string;
    options?: { value: string; label: string }[];
    required: boolean;
  }[];
}

export interface ImageEditResult {
  imageUrl: string | null;
  text: string | null;
}
