export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string | null
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          label: string | null
          phone: string | null
          postal_code: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone?: string | null
          postal_code: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone?: string | null
          postal_code?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          item_count: number | null
          season: string | null
          slug: string
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          item_count?: number | null
          season?: string | null
          slug: string
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          item_count?: number | null
          season?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          balance: number
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          original_amount: number
        }
        Insert: {
          balance: number
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          original_amount: number
        }
        Update: {
          balance?: number
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          original_amount?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_name: string
          product_variant_id: string | null
          quantity: number
          unit_price: number
          variant_info: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_name: string
          product_variant_id?: string | null
          quantity?: number
          unit_price: number
          variant_info?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_name?: string
          product_variant_id?: string | null
          quantity?: number
          unit_price?: number
          variant_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_method: string | null
          discount: number | null
          gift_card_amount_used: number | null
          gift_card_id: string | null
          guest_email: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string | null
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_method?: string | null
          discount?: number | null
          gift_card_amount_used?: number | null
          gift_card_id?: string | null
          guest_email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_method?: string | null
          discount?: number | null
          gift_card_amount_used?: number | null
          gift_card_id?: string | null
          guest_email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          position: number | null
          product_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          position?: number | null
          product_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          position?: number | null
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color_hex: string
          color_name: string
          created_at: string | null
          id: string
          price_override: number | null
          product_id: string
          size: string
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          color_hex: string
          color_name: string
          created_at?: string | null
          id?: string
          price_override?: number | null
          product_id: string
          size: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          color_hex?: string
          color_name?: string
          created_at?: string | null
          id?: string
          price_override?: number | null
          product_id?: string
          size?: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          care: string | null
          category: string
          created_at: string | null
          description: string | null
          details: Json | null
          featured: boolean | null
          id: string
          in_stock: boolean | null
          materials: string | null
          name: string
          original_price: number | null
          price: number
          slug: string
          subcategory: string
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          care?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          details?: Json | null
          featured?: boolean | null
          id?: string
          in_stock?: boolean | null
          materials?: string | null
          name: string
          original_price?: number | null
          price: number
          slug: string
          subcategory: string
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          care?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          details?: Json | null
          featured?: boolean | null
          id?: string
          in_stock?: boolean | null
          materials?: string | null
          name?: string
          original_price?: number | null
          price?: number
          slug?: string
          subcategory?: string
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          default_address_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          default_address_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          default_address_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      product_catalog: {
        Row: {
          badge: string | null
          category: string | null
          colors: Json | null
          created_at: string | null
          featured: boolean | null
          id: string | null
          in_stock: boolean | null
          materials: string | null
          name: string | null
          original_price: number | null
          price: number | null
          primary_image: string | null
          secondary_image: string | null
          sizes: Json | null
          slug: string | null
          subcategory: string | null
          tagline: string | null
          variant_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
