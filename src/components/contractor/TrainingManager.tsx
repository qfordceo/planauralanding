import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Video, UserPlus } from "lucide-react";

interface TrainingManagerProps {
  contractorId: string;
}

export function TrainingManager({ contractorId }: TrainingManagerProps) {
  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="workshops">Workshops</TabsTrigger>
      </TabsList>

      <TabsContent value="courses">
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Video className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Safety Standards 2024</h3>
                  <p className="text-sm text-muted-foreground">Updated safety protocols and best practices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Project Management Essentials</h3>
                  <p className="text-sm text-muted-foreground">Learn to manage construction projects effectively</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="certifications">
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <UserPlus className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Professional Contractor Certification</h3>
                  <p className="text-sm text-muted-foreground">Industry-recognized certification program</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="workshops">
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Video className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Sustainable Building Practices</h3>
                  <p className="text-sm text-muted-foreground">Live workshop on eco-friendly construction methods</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}