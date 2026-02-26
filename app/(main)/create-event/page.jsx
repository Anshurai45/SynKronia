/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { State, City } from "country-state-city";
import { CalendarIcon, Crown, Loader2, Sparkles } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import UpgradeModal from "@/components/upgrade-modal";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

// ✅ Import the responsive CSS file
import "./create-event.css";
import { UnsplashImagePicker } from "@/components/unsplash-image-picker";
 import AiEventCreator from "./_components/ai-event-creator"
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1e3a8a"),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
const createEvent = useMutation(api.events.createEvent);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "#1e3a8a",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    },
  });

  const themeColor = watch("themeColor");
  const ticketType = watch("ticketType");
  const selectedState = watch("state");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const coverImage = watch("coverImage");

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const cities = useMemo(() => {
    if (!selectedState) return [];
    const st = indianStates.find((s) => s.name === selectedState);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [selectedState, indianStates]);



  const colorPresets = [
    "#1e3a8a",
    ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843",  "#0f172a", 
        "#111827", 
        "#1f2937", 
        "#3f3f46", 
        "#0c0a09", 
        "#5b21b6", 
        "#134e4a", 
        "#78350f", 
        "#2e1065", 
        "#052e16", ] : []),
  ];

  const handleColorClick = (color) => {
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  };

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  console.log(createEvent, "create event");
  // console.log(api.events ,"api");
// console.log(api.events.createEvent, "create");

  const onSubmit = async (data) => {

    console.log(data);
    
    try {
      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Please select both date and time for start and end.");
        return;
      }
      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time.");
        return;
      }

      if (!hasPro && currentUser?.freeEventsCreated >= 1) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      if (data.themeColor !== "#1e3a8a" && !hasPro) {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      setIsSubmitting(true);

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        city: data.city,
        state: data.state || undefined,
        country: "India",
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
      });

      setIsSubmitting(false);

      toast.success("Event created successfully! 🎉");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    }
  };


  const handleAIGenerate =(generatedData) => {
     setValue("title", generatedData.title);
    setValue("description", generatedData.description);
    setValue("category", generatedData.category);
    setValue("capacity", generatedData.suggestedCapacity);
    setValue("ticketType", generatedData.suggestedTicketType);
    toast.success("Event details filled! Customize as needed.");


  }

  return (
    /* ✅ "create-event-page" class used for small-mobile padding override */
    <div
      className="create-event-page min-h-screen transition-colors duration-300 px-6 py-8"
      style={{ backgroundColor: themeColor }}
    >
      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-white">Create Event</h1>
        {!hasPro && (
          <p className="text-sm text-white/60 mt-1 mb-6">
            Free: {currentUser?.freeEventsCreated || 0}/1 events created
          </p>
        )}
      </div>

    
      {/*
        ✅ "create-event-layout" CSS class:
        — desktop: flex-direction: row  (side by side)
        — ≤768px:  flex-direction: column (stacked)
      */}
      <div className="create-event-layout">
        {/* ── LEFT PANEL ── */}
        {/*
          ✅ "create-event-left" CSS class:
          — desktop: width:300px, sticky
          — ≤768px:  width:100%, position:static
        */}
        <div className="create-event-left">
          {/*
            ✅ "cover-image-box" CSS class:
            — desktop: height:300px
            — ≤768px:  height:220px
            — ≤480px:  height:180px
          */}
          <div
            className="cover-image-box"
            onClick={() => setShowImagePicker(true)}
          >
            {coverImage ? (
              <Image
                src={coverImage}
                className="w-full h-full  object-cover"
                alt="Cover"
                width={300}
                height={300}
                priority
              />
            ) : (
              <span>Click to add cover image</span>
            )}
          </div>

          {/* Theme Color Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-white">Theme Color</Label>
              {!hasPro && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Crown className="w-3 h-3" />
                  Pro
                </Badge>
              )}
            </div>

            {/* ✅ "color-presets" CSS class for the dots row */}
            <div className="color-presets">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-dot ${themeColor === color ? "active" : ""} ${
                    !hasPro && color !== "#1e3a8a" ? "locked" : ""
                  }`}
                  // className={`w-10 h-10 rounded-full border-2 transition-all ${!hasPro && color !== "1e3a8a" ? "opacity-40 cursor-not-allowed " :"hover:scale-110"}`}
                  style={{ backgroundColor: color , borderColor: themeColor === color ? "white" :"transparent"}}
                  onClick={() => handleColorClick(color)}
                  title={
                    !hasPro && color !== "#1e3a8a"
                      ? "Upgrade to Pro for custom colors"
                      : color
                  }
                />
              ))}
              {!hasPro && (
                <button
                  type="button"
                  className="color-dot-add"
                  onClick={() => {
                    setUpgradeReason("color");
                    setShowUpgradeModal(true);
                  }}
                  title="Unlock more colors with Pro"
                >
                  <Sparkles
                    style={{ width: 16, height: 16, color: "#a78bfa" }}
                  />
                </button>
              )}
            </div>

            {!hasPro && (
              <p className="text-xs text-white/50 mt-2">
                Upgrade to Pro to unlock custom theme colors
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL — Form ── */}
        {/*
          ✅ "create-event-right" CSS class:
          — desktop: flex-grow:1, min-width:0
          — ≤768px:  width:100%
        */}

        
        <div className="create-event-right">
           <div className="mb-4"><AiEventCreator  onEventGenerated={handleAIGenerate}  /> </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Event Title */}
            <div>
              <Input
                {...register("title")}
                placeholder="Event Name"
                className="text-3xl font-semibold bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/40 px-3 mb-2"
              />
              {errors.title && (
                <p className="text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/*
              ✅ "datetime-grid" CSS class:
              — desktop: 2 columns
              — ≤768px:  1 column (Start and End stack)
            */}
            <div className="datetime-grid">
              {/* Start */}
              <div className="space-y-2">
                <Label className="text-sm text-white">Start</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {startDate ? format(startDate, "PPP") : "Pick date"}
                        <CalendarIcon className="w-4 h-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => setValue("startDate", date)}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    {...register("startTime")}
                    className="w-28 bg-white/10 border-white/20 text-white"
                  />
                </div>
                {(errors.startDate || errors.startTime) && (
                  <p className="text-sm text-red-400">
                    {errors.startDate?.message || errors.startTime?.message}
                  </p>
                )}
              </div>

              {/* End */}
              <div className="space-y-2">
                <Label className="text-sm text-white">End</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {endDate ? format(endDate, "PPP") : "Pick date"}
                        <CalendarIcon className="w-4 h-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => setValue("endDate", date)}
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    {...register("endTime")}
                    className="w-28 bg-white/10 border-white/20 text-white mb-2"
                  />
                </div>
                {(errors.endDate || errors.endTime) && (
                  <p className="text-sm text-red-400">
                    {errors.endDate?.message || errors.endTime?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-sm text-white">Location</Label>
              {/*
                ✅ "location-grid" CSS class:
                — desktop: 2 columns
                — ≤768px:  1 column (State and City stack)
              */}
              <div className="location-grid">
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("city", "");
                      }}
                    >
                      <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((s) => (
                          <SelectItem key={s.isoCode} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedState}
                    >
                      <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                        <SelectValue
                          placeholder={
                            selectedState ? "Select city" : "Select state first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-white">Venue Details</Label>
                <Input
                  {...register("venue")}
                  placeholder="Venue link (Google Maps Link)"
                  type="url"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                {errors.venue && (
                  <p className="text-sm text-red-400">{errors.venue.message}</p>
                )}
                <Input
                  {...register("address")}
                  placeholder="Full address / street / building (optional)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mb-2 "
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Tell people about your event..."
                rows={4}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mb-2"
              />
              {errors.description && (
                <p className="text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Ticketing */}
            <div className="space-y-3 mb-4">
              <Label className="text-sm text-white">Tickets</Label>
              <div className="flex items-center gap-6 text-white">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="free"
                    {...register("ticketType")}
                    defaultChecked
                  />
                  Free
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="paid"
                    {...register("ticketType")}
                  />
                  Paid
                </label>
              </div>
              {ticketType === "paid" && (
                <Input
                  type="number"
                  placeholder="Ticket price ₹"
                  {...register("ticketPrice", { valueAsNumber: true })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              )}
            </div>

            {/* Capacity */}
            <div className="space-y-2 mb-6">
              <Label className="text-sm text-white">Capacity</Label>
              <Input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                placeholder="Ex: 100"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              {errors.capacity && (
                <p className="text-sm text-red-400">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            

            {/* Submit */}
            <Button
              variant="default"
              type="submit"
            disabled={isSubmitting}
              className="w-full py-6 text-lg  rounded-xl font-semibold mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </div>
      </div>

    {showImagePicker && (
      <UnsplashImagePicker 
      isOpen={showImagePicker}
      onClose ={() => setShowImagePicker(false)}
       onSelect={(url) => {
        setValue("coverImage",url);
        setShowImagePicker(false);
       }}
      />
    )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeReason}
      />
    </div>
  );
}
