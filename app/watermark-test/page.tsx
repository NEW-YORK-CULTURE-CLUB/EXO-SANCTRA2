'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WatermarkService } from '@/lib/watermark-service';
import { toast } from 'sonner';
import { Download, TestTube, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WatermarkTestPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const router = useRouter();

  const testImageAccessibility = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Use the comprehensive testing method from WatermarkService
      const result = await WatermarkService.testImageAccessibility(imageUrl);
      setTestResults(result);
      
      if (result.accessible) {
        toast.success(`Image accessible via ${result.method} method`);
      } else {
        toast.error('Image not accessible via any method');
      }
      
    } catch (error) {
      console.error('Test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Test failed: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const testProxyAPI = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    try {
      setIsProcessing(true);
      
      const result = await WatermarkService.testProxyAPI(imageUrl);
      
      if (result.success) {
        toast.success(`Proxy API working! Status: ${result.status}`);
        console.log('Proxy test result:', result);
      } else {
        toast.error(`Proxy API failed: ${result.error}`);
        console.log('Proxy test failed:', result);
      }
      
    } catch (error) {
      console.error('Proxy test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Proxy test failed: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const testWatermark = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    try {
      setIsProcessing(true);
      
      toast.info('Processing image with watermark...');
      
      // Try to download with watermark
      await WatermarkService.downloadImageWithWatermark(imageUrl, 'watermark-test.jpg');
      
      toast.success('Watermark test successful! Image downloaded.');
      
    } catch (error) {
      console.error('Watermark test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Watermark test failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const testWatermarkAccessibility = async () => {
    try {
      setIsProcessing(true);
      
      const result = await WatermarkService.testWatermarkAccessibility();
      
      if (result.accessible) {
        toast.success('Watermark image accessible!');
        console.log('Watermark test result:', result);
      } else {
        toast.error(`Watermark image not accessible: ${result.error}`);
        console.log('Watermark test failed:', result);
      }
      
    } catch (error) {
      console.error('Watermark test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Watermark test failed: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Watermark Service Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the watermark functionality and image accessibility
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="w-5 h-5" />
              <span>Test Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL to Test</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter a Firebase Storage URL or any other image URL to test
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={testImageAccessibility}
                disabled={isProcessing || !imageUrl.trim()}
                variant="outline"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Accessibility
              </Button>
              
              <Button
                onClick={testProxyAPI}
                disabled={isProcessing || !imageUrl.trim()}
                variant="outline"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Proxy API
              </Button>
              
              <Button
                onClick={testWatermarkAccessibility}
                disabled={isProcessing}
                variant="outline"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Watermark
              </Button>
              
              <Button
                onClick={testWatermark}
                disabled={isProcessing || !imageUrl.trim()}
              >
                <Download className="w-4 h-4 mr-2" />
                Test Watermark
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">Test Result:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  testResults.accessible 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.accessible ? '✅ Accessible' : '❌ Not Accessible'}
                </span>
              </div>
              
              {testResults.accessible && (
                <div className="text-sm text-green-700">
                  <strong>Method:</strong> {testResults.method}
                </div>
              )}
              
              {!testResults.accessible && testResults.error && (
                <div className="text-sm text-red-700">
                  <strong>Error:</strong> {testResults.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sample URLs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sample Test URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Try these sample URLs to test different scenarios:
              </p>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageUrl('https://picsum.photos/800/600')}
                  className="w-full justify-start text-left"
                >
                  Picsum Photos (Public, CORS-friendly)
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageUrl('https://via.placeholder.com/800x600/000000/FFFFFF?text=Test+Image')}
                  className="w-full justify-start text-left"
                >
                  Placeholder.com (Public, CORS-friendly)
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageUrl('https://firebasestorage.googleapis.com/v0/b/test-bucket/o/test-image.jpg?alt=media')}
                  className="w-full justify-start text-left"
                >
                  Firebase Storage (Example URL)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
