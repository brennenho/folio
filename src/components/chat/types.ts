export interface DocumentTab {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  tab_id: number;
  is_user: boolean;
  content: Content;
}

interface Content {
  text: string;
  investment_response?: string;
  portfolio?: {
    thesis: string;
    generated_at: string;
    generation_metadata: {
      attempt: number;
      error_companies: number;
      total_companies: number;
      valid_companies: number;
      companies_removed: number;
      final_valid_companies: number;
    };
    portfolio_components: Components[];
  };
}

export interface Components {
  component_name: string;
  component_description: string;
  companies: Company[];
}

export interface Company {
  name: string;
  ticker: string;
  specialization: string;
  investment_thesis: Record<string, string>;
  financial_metrics: Record<string, string>;
}
