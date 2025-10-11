import sharp from 'sharp';
import axios from 'axios';

class SimpleImageAnalysisService {
  constructor() {
    this.productDatabase = {
      'apple': {
        name: 'Apple',
        variety: 'Red Delicious',
        nutritionalInfo: { calories: 52, protein: '0.3g', carbs: '14g', fiber: '2.4g', vitaminC: '4.6mg' },
        recommendations: ['Store in cool, dry place', 'Consume within 2-3 weeks', 'Keep away from other fruits']
      },
      'tomato': {
        name: 'Tomato',
        variety: 'Cherry Tomato',
        nutritionalInfo: { calories: 18, protein: '0.9g', carbs: '3.9g', fiber: '1.2g', vitaminC: '12.7mg' },
        recommendations: ['Store at room temperature', 'Refrigerate when ripe', 'Consume within 5-7 days']
      },
      'carrot': {
        name: 'Carrot',
        variety: 'Orange Carrot',
        nutritionalInfo: { calories: 41, protein: '0.9g', carbs: '9.6g', fiber: '2.8g', vitaminC: '5.9mg' },
        recommendations: ['Store in refrigerator', 'Keep in plastic bag', 'Consume within 2-3 weeks']
      },
      'lettuce': {
        name: 'Lettuce',
        variety: 'Romaine',
        nutritionalInfo: { calories: 15, protein: '1.4g', carbs: '2.9g', fiber: '1.3g', vitaminC: '4mg' },
        recommendations: ['Store in refrigerator', 'Keep dry', 'Consume within 1 week']
      }
    };
  }

  async analyzeImage(imageBuffer) {
    try {
      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Simulate analysis based on image properties
      const analysisResult = await this.simulateAnalysis(metadata);
      
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async simulateAnalysis(metadata) {
    // Simulate product detection based on image characteristics
    const products = Object.keys(this.productDatabase);
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const productData = this.productDatabase[randomProduct];
    
    // Calculate freshness score based on image properties
    const freshnessScore = this.calculateFreshnessScore(metadata);
    
    // Generate confidence score
    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
    
    return {
      detectedProducts: [{
        name: randomProduct,
        confidence: confidence
      }],
      freshnessScore: freshnessScore,
      nutritionalInfo: productData.nutritionalInfo,
      recommendations: productData.recommendations,
      imageMetadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      }
    };
  }

  calculateFreshnessScore(metadata) {
    // Simple freshness calculation based on image properties
    // In a real implementation, this would analyze color, texture, etc.
    let score = 85; // Base score
    
    // Adjust based on image quality
    if (metadata.width > 1000 && metadata.height > 1000) {
      score += 5; // High resolution = better quality
    }
    
    // Add some randomness to simulate real analysis
    score += Math.random() * 10 - 5;
    
    return Math.max(60, Math.min(100, Math.round(score)));
  }

  // Method to add new products to the database
  addProduct(productKey, productData) {
    this.productDatabase[productKey] = productData;
  }

  // Method to get all available products
  getAvailableProducts() {
    return Object.keys(this.productDatabase);
  }
}

export default new SimpleImageAnalysisService();
