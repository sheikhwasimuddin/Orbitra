export type PredictionItem = {
  label: string;
  confidence: number;
};

export type AnalyzeResponse = {
  success: boolean;
  model: string;
  predictions: PredictionItem[];
  embedding_summary: {
    dimension: number;
    mean: number;
    std: number;
  };
  analysis_time_ms: number;
};

export type SimilarityItem = {
  id: string;
  title: string;
  similarity: number;
  thumbnail: string;
};

export type SimilarityResponse = {
  success: boolean;
  query_model: string;
  results: SimilarityItem[];
};

export type CompareResponse = {
  success: boolean;
  image1_top_class: string;
  image2_top_class: string;
  cosine_similarity: number;
  change_score: number;
};

export type PrithviResponse = {
  success: boolean;
  model: string;
  token_shape: number[];
  embedding_shape: number[];
  embedding_preview: number[];
  embedding_stats: {
    mean: number;
    std: number;
    min: number;
    max: number;
  };
  metadata: {
    img_size: number;
    in_chans: number;
    num_frames: number;
    bands: string[];
  };
};
