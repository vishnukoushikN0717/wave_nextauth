"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Users,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  UserCircle,
  BadgeCheck,
  PhoneCall,
  Fan as Fax,
  Building,
  Map,
  Share2,
  Save,
  X,
  Mail,
  Phone,
  Linkedin as LinkedinIcon,
  Facebook,
  Instagram,
  Twitter,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { states } from "@/lib/location-data";
// import { dummyInternalUser } from "@/lib/dummy-data";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

interface UserProfile {
  id: string;
  email: string;
  userRole: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  jobRole: string;
  wavExternalUserId: string;
  regionAllocated: string;
  state: string;
  city: string;
  county: string;
  zipCode: string;
  address: string;
  mapLink: string;
  divisionalGroup: string;
  division: string;
  subdivision: string;
  sector: string;
  phone: string;
  alternatePhone: string;
  faxNumber: string;
  linkedinID: string;
  facebookID: string;
  instagramID: string;
  twitterID: string;
}

const formSchema = z.object({
  email: z.string().email("Invalid email format"),
  userRole: z.string().min(1, "User role is required"),
  firstName: z.string().optional().or(z.literal("")),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  jobRole: z.string().optional().or(z.literal("")),
  wavExternalUserId: z.string().optional().or(z.literal("")),
  regionAllocated: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  county: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  mapLink: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  divisionalGroup: z.string().optional().or(z.literal("")),
  division: z.string().optional().or(z.literal("")),
  subdivision: z.string().optional().or(z.literal("")),
  sector: z.string().optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  alternatePhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  faxNumber: z.string().optional().or(z.literal("")),
  linkedinID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  facebookID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  instagramID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  twitterID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal(""))
});

export default function EditExternalProfile() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      userRole: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      jobRole: "",
      wavExternalUserId: "",
      regionAllocated: "",
      state: "",
      city: "",
      county: "",
      zipCode: "",
      address: "",
      mapLink: "",
      divisionalGroup: "",
      division: "",
      subdivision: "",
      sector: "",
      phone: "",
      alternatePhone: "",
      faxNumber: "",
      linkedinID: "",
      facebookID: "",
      instagramID: "",
      twitterID: "",
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/WAVExternalUser/${params.id}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        setOriginalData(data);
        
        // Reset form with data, ensuring empty strings for undefined values
        form.reset({
          email: data.email || "",
          userRole: data.userRole || "",
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          dob: data.dob || "",
          gender: data.gender || "",
          jobRole: data.jobRole || "",
          wavExternalUserId: data.wavExternalUserId || "",
          regionAllocated: data.regionAllocated || "",
          state: data.state || "",
          city: data.city || "",
          county: data.county || "",
          zipCode: data.zipCode || "",
          address: data.address || "",
          mapLink: data.mapLink || "",
          divisionalGroup: data.divisionalGroup || "",
          division: data.division || "",
          subdivision: data.subdivision || "",
          sector: data.sector || "",
          phone: data.phone || "",
          alternatePhone: data.alternatePhone || "",
          faxNumber: data.faxNumber || "",
          linkedinID: data.linkedinID || "",
          facebookID: data.facebookID || "",
          instagramID: data.instagramID || "",
          twitterID: data.twitterID || "",
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error("Failed to fetch user data");
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const updatedData = {
        ...originalData,
        ...values,
      };

      const response = await fetch(`/api/WAVExternalUser/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      toast.success("Profile updated successfully");
      router.push(`/internal/dashboard/external-profile/${params.id}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
      {/* Breadcrumb with Go to Accounts button */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <span className="text-blue-600 dark:text-blue-400 font-medium">Dashboard</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Edit External Profile</span>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/internal/user')}
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
        >
          <Users className="h-4 w-4" />
          Go to Accounts
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Account Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        User Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="External Admin">External Admin</SelectItem>
                        <SelectItem value="External User">External User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Personal Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-gray-500" />
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-gray-500" />
                        Middle Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-gray-500" />
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        Gender
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Job Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        Job Role
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wavExternalUserId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        Job WAV External ID
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Location Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="regionAllocated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Map className="h-4 w-4 text-gray-500" />
                        Region Allocated
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        State
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        City
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        County
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        zipCode
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mapLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-gray-500" />
                        Map Link
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="divisionalGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        Divisional Group
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        Division
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subdivision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        Subdivision
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        Sector
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Contact Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <PhoneCall className="h-4 w-4 text-gray-500" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        Alternate Phone
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="faxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Fax className="h-4 w-4 text-gray-500" />
                        Fax Number
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Social Media
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="linkedinID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkedinIcon className="h-4 w-4 text-gray-500" />
                        LinkedIn Profile URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/in/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebookID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-gray-500" />
                        Facebook Profile URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://facebook.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-gray-500" />
                        Instagram Profile URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://instagram.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitterID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-gray-500" />
                        Twitter Profile URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://twitter.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}