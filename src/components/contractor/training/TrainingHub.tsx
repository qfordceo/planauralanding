import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Video, Certificate, FileText } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  type: "video" | "document" | "interactive";
}

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Safety Standards 2024",
    description: "Essential safety protocols for modern construction",
    progress: 75,
    type: "video"
  },
  {
    id: "2",
    title: "Project Management Fundamentals",
    description: "Learn to manage construction projects effectively",
    progress: 30,
    type: "interactive"
  },
  {
    id: "3",
    title: "Building Code Updates",
    description: "Latest updates to building codes and regulations",
    progress: 0,
    type: "document"
  }
];

export function TrainingHub() {
  const [activeTab, setActiveTab] = useState("courses");

  const getIcon = (type: Course["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      case "interactive":
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="courses">
        <div className="grid gap-4">
          {MOCK_COURSES.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {getIcon(course.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-4">
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.progress}% complete
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="certifications">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Certificate className="h-5 w-5" />
                Available Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Professional Contractor License</h4>
                    <p className="text-sm text-muted-foreground">
                      State-recognized certification for general contractors
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">40 hours</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Safety Management Certificate</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced safety protocols and management
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">25 hours</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="resources">
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Contract Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Standardized contract templates for various project types
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Safety Checklists</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive safety inspection checklists
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Equipment Guides</h4>
                    <p className="text-sm text-muted-foreground">
                      Operation manuals for common construction equipment
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}