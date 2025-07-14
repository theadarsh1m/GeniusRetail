"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getStyleAdvice, type StyleAdvisorOutput } from "@/ai/flows/style-advisor";
import { products, type Product } from "@/lib/mock-data";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductCard } from "@/components/product-card";
import { Loader2, Wand2, User, Palette, Sparkles, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StyleAdvisorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StyleAdvisorOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);


  const handleAnalyzeClick = async () => {
    if (!videoRef.current || !canvasRef.current) {
        setError("Camera is not ready. Please wait a moment and try again.");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error("Could not get canvas context.");
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);

      const response = await getStyleAdvice({ photoDataUri: dataUri });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the photo. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedProducts = result
    ? products.filter(p => result.recommendedProductTags.some(tag => p.tags.includes(tag)))
    : [];

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">AI Style Advisor</h1>
        <p className="text-muted-foreground">
          Use your camera to get personalized fashion recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Live Camera</CardTitle>
            <CardDescription>Position your face in the frame and capture an image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-square w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />

                {hasCameraPermission === false && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-bold">Camera Access Denied</h3>
                        <p className="text-sm text-muted-foreground">Please enable camera permissions to use the Style Advisor.</p>
                     </div>
                )}
                 {hasCameraPermission === null && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                )}
            </div>
            
            <Button onClick={handleAnalyzeClick} disabled={isLoading || !hasCameraPermission} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Capture & Analyze Mood
                </>
              )}
            </Button>
            {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}
          
          {!result && !isLoading && capturedImage && (
             <Card>
                <CardHeader>
                    <CardTitle>Captured Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image src={capturedImage} alt="Captured from webcam" width={400} height={400} className="rounded-md mx-auto" />
                </CardContent>
             </Card>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User /> Facial Analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-bold text-lg">{result.facialAnalysis.gender}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-bold text-lg">{result.facialAnalysis.age}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Face Shape</p>
                        <p className="font-bold text-lg">{result.facialAnalysis.faceShape}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Mood</p>
                        <p className="font-bold text-lg">{result.facialAnalysis.mood}</p>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Palette /> Your Style Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.styleAdvice}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Sparkles /> Recommended For You</h3>
                {recommendedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <Alert>
                        <AlertTitle>No specific products found</AlertTitle>
                        <AlertDescription>We couldn't find specific products matching your style profile. Please try another photo!</AlertDescription>
                    </Alert>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
