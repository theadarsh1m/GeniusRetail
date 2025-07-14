
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { suggestOutfit, type OutfitSuggesterOutput } from "@/ai/flows/outfit-suggester";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Sparkles, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SmartStylistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OutfitSuggesterOutput | null>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async (type: 'image' | 'text') => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (type === 'image' && uploadedImage) {
        response = await suggestOutfit({ photoDataUri: uploadedImage });
      } else if (type === 'text' && textDescription) {
        response = await suggestOutfit({ description: textDescription });
      } else {
        throw new Error("No input provided.");
      }
      setResult(response);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get suggestions. ${errorMessage}`);
      toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'There was an error generating outfit suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
    
  const triggerFileInput = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Smart Outfit Stylist</h1>
        <p className="text-muted-foreground">
          Upload a photo or describe an item, and I'll build an outfit around it!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Analyze Your Item</CardTitle>
            <CardDescription>Choose your preferred method below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                <TabsTrigger value="text">Describe It</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4 space-y-4">
                 <div className="relative aspect-square w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    {uploadedImage ? (
                        <Image src={uploadedImage} alt="Uploaded for analysis" layout="fill" objectFit="cover" />
                    ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <Upload className="h-12 w-12 mx-auto mb-2"/>
                            <p>Upload a clear photo of one clothing item.</p>
                        </div>
                    )}
                 </div>
                 <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                 <Button onClick={triggerFileInput} variant="outline" className="w-full" disabled={isLoading}>
                    Choose File
                 </Button>
                 <Button onClick={() => handleAnalysis('image')} disabled={isLoading || !uploadedImage} className="w-full">
                   <Sparkles className="mr-2 h-4 w-4" />
                   Suggest an Outfit
                 </Button>
              </TabsContent>

              <TabsContent value="text" className="mt-4 space-y-4">
                 <div className="text-center text-muted-foreground p-4 bg-muted rounded-md">
                    <FileText className="h-12 w-12 mx-auto mb-2"/>
                    <p>Describe a single clothing item.</p>
                 </div>
                 <Textarea 
                    placeholder="e.g., 'A maroon cotton kurti' or 'My new blue denim jacket'"
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    rows={4}
                    disabled={isLoading}
                 />
                 <Button onClick={() => handleAnalysis('text')} disabled={isLoading || !textDescription} className="w-full">
                   <Wand2 className="mr-2 h-4 w-4" />
                   Suggest an Outfit
                 </Button>
              </TabsContent>
            </Tabs>
            {error && <Alert variant="destructive" className="mt-4"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && (
            <Card className="flex flex-col justify-center items-center min-h-[400px] rounded-lg border border-dashed">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Our AI stylist is thinking...</p>
            </Card>
          )}
          
          {result && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles /> AI Outfit Suggestion</CardTitle>
                    <CardDescription>Here's a complete look built around your item.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div>
                        <h3 className="font-semibold text-lg mb-2">Your Item:</h3>
                        <Alert>
                            <Wand2 className="h-4 w-4"/>
                            <AlertTitle>{result.mainItem}</AlertTitle>
                        </Alert>
                   </div>
                   <div>
                        <h3 className="font-semibold text-lg mb-2">Complete the Look With:</h3>
                        <ul className="space-y-3">
                            {result.complementary.map((item, index) => (
                                <li key={index}>
                                    <Alert variant="default" className="border-green-300">
                                        <CheckCircle2 className="h-4 w-4 text-green-600"/>
                                        <AlertDescription className="text-foreground font-medium">{item}</AlertDescription>
                                    </Alert>
                                </li>
                            ))}
                        </ul>
                   </div>
                </CardContent>
             </Card>
          )}

          {!isLoading && !result && (
            <Card className="flex flex-col justify-center items-center min-h-[400px] rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground p-8">
                    <Wand2 className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Your Outfit Awaits</h2>
                    <p>Upload a picture of a clothing item or describe it to get started.</p>
                </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
