"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  BatteryMedium,
  CalendarDays,
  ChevronDownIcon,
  ChevronRight,
  Clock3,
  ImagePlus,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import React from "react";
import { EventsDate } from "../types/auth.types";
import { api } from "@/lib/api";

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const eventTypes = [
  "Descuento",
  "Espectáculo",
  "Oferta Relámpago",
  "Menú Especial",
];

export function EventsModal({ isOpen, onClose }: EventsModalProps) {

  const [selectedType, setSelectedType] = useState("Descuento");
  const [publishNow, setPublishNow] = useState(true);
  const [startOpen, setStartOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endOpen, setEndOpen] = React.useState(false);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

  // image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // estado de envio
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // date events
  const [eventsDate, setEventsDate] = useState<EventsDate>({
    name_events: "",
    type_events: "",
    description_events: "",
    conditions_events: "",
    start_date: new Date(),
    start_time: new Date(`1970-01-01T10:30:00`),
    end_date: new Date(),
    end_time: new Date(`1970-01-01T10:30:00`),
    event_image: "",
  });

  // Time strings for inputs (controlled directly)
  const [startTimeStr, setStartTimeStr] = useState("10:30");
  const [endTimeStr, setEndTimeStr] = useState("10:30");



  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if(!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return previewUrl;
    });
    setEventsDate({ ...eventsDate, event_image: previewUrl });
  }

  function resetForm() {
    setSelectedType("Descuento");
    setPublishNow(true);
    setStartOpen(false);
    setStartDate(undefined);
    setEndOpen(false);
    setEndDate(undefined);
    setImageFile(null);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setEventsDate({
      name_events: "",
      type_events: "",
      description_events: "",
      conditions_events: "",
      start_date: new Date(),
      start_time: new Date(`1970-01-01T10:30:00`),
      end_date: new Date(),
      end_time: new Date(`1970-01-01T10:30:00`),
      event_image: "",
    });
    setStartTimeStr("10:30");
    setEndTimeStr("10:30");
    setSubmitError(null);
    setSubmitSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      // Validar campos requeridos
      if (!eventsDate.name_events || !eventsDate.type_events) {
        setSubmitError("Por favor completa el nombre y tipo de evento");
        setIsSubmitting(false);
        return;
      }

      // Validar que las horas sean válidas
      if (!startTimeStr || !endTimeStr) {
        setSubmitError("Por favor selecciona horas válidas para el evento");
        setIsSubmitting(false);
        return;
      }

      console.log('startTimeStr:', startTimeStr);
      console.log('endTimeStr:', endTimeStr);

      // Obtener el token de las cookies
      const getToken = () => {
        if (typeof document !== 'undefined') {
          const match = document.cookie.match(/auth_token=([^;]+)/);
          return match ? match[1] : '';
        }
        return '';
      };
      const token = getToken();

      // Preparar datos para enviar - convertir HH:mm a HH:mm:ss
      const formatTime = (time: string) => {
        if (!time || time === '') {
          return '10:30:00'; // valor por defecto
        }
        if (time.includes(':')) {
          const parts = time.split(':');
          if (parts.length === 2) {
            return `${time}:00`;
          }
          return time;
        }
        return `${time}:00`;
      };

      const formattedStartTime = formatTime(startTimeStr);
      const formattedEndTime = formatTime(endTimeStr);

      console.log('formattedStartTime:', formattedStartTime);
      console.log('formattedEndTime:', formattedEndTime);

      const payload = {
        ...eventsDate,
        start_date: eventsDate.start_date.toISOString().split('T')[0],
        start_time: formattedStartTime,
        end_date: eventsDate.end_date.toISOString().split('T')[0],
        end_time: formattedEndTime,
      };

      console.log('Payload completo:', payload);

      // Llamada al API usando el mismo flujo que otros endpoints
      const result = await api.createEventApi(payload, token || "");

      setSubmitSuccess(true);
      resetForm();

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || 'Error al crear el evento');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="md:max-w-7xl w-full p-0">
        <ScrollArea className="max-h-[95vh]">
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="size-3" /> Nueva campaña
                </p>
                <h1
                  id="initiative-title"
                  className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Lanzar Iniciativa
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Diseña y programa nuevas promociones o espectáculos para tu
                  restaurante.
                </p>
              </div>
            </div>

            {/* Mensajes de error y éxito */}
            {submitError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-600">
                ¡Evento creado exitosamente! Cerrando modal...
              </div>
            )}

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
              {/* -------- Formulario -------- */}
              <section className="space-y-4">
                {/* Nombre y tipo de evento */}
                <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                  <FieldLabel className="mb-3" htmlFor="event-name">
                    Nombre del evento o promoción
                  </FieldLabel>
                  <input
                    id="event-name"
                    value={eventsDate.name_events}
                    onChange={(e) => setEventsDate({...eventsDate, name_events: e.target.value})}
                    placeholder="Ej. Noche de Jazz & Vinos"
                    className="w-full rounded-lg border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />

                  <FieldLabel className="mt-6 mb-3">Tipo de evento</FieldLabel>
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Tipo de evento"
                  >
                    {eventTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setEventsDate({ ...eventsDate, type_events: type });
                        }}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selectedType === type
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descripción y condiciones */}
                <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                  <FieldLabel className="mb-3" htmlFor="description">
                    Descripción detallada
                  </FieldLabel>
                  <textarea
                    id="description"
                    value={eventsDate.description_events}
                    onChange={(e) => setEventsDate({...eventsDate, description_events: e.target.value})}
                    rows={4}
                    placeholder="Describe qué hace especial a este evento..."
                    className="w-full rounded-lg border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />

                  <FieldLabel htmlFor="conditions" className="mt-6 mb-3">
                    Condiciones{" "}
                    <span className="font-normal normal-case tracking-normal text-muted-foreground">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <input
                    id="conditions"
                    value={eventsDate.conditions_events}
                    onChange={(e) => setEventsDate({...eventsDate, conditions_events: e.target.value})}
                    placeholder="Ej. Solo los primeros 10 en llegar"
                    className="w-full rounded-lg border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                {/* Fechas e imagen */}
                <div className="grid gap-5 sm:grid-cols-2 ">
                  <div className="border-2 rounded-xl py-5">
                    <FieldGroup className="mx-auto max-w-xs flex-row">
                      <Field>
                        <FieldLabel htmlFor="date-picker-start">
                          Fecha de inicio
                        </FieldLabel>
                        <Popover open={startOpen} onOpenChange={setStartOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              id="date-picker-start"
                              className="w-32 bg-gray-100 text-black justify-between font-normal"
                            >
                              {startDate
                                ? format(startDate, "PPP")
                                : "Select date"}
                              <ChevronDownIcon data-icon="inline-end" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={startDate}
                              captionLayout="dropdown"
                              defaultMonth={startDate}
                              onSelect={(date) => {
                                setStartDate(date);
                                setEventsDate({ ...eventsDate, start_date: date || new Date() });
                                setStartOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                      <Field className="w-32">
                        <FieldLabel htmlFor="time-picker-start">
                          Hora inicio
                        </FieldLabel>
                        <Input
                          type="time"
                          id="time-picker-start"
                          step="1"
                          value={startTimeStr}
                          onChange={(e) => {
                            setStartTimeStr(e.target.value);
                            setEventsDate({ ...eventsDate, start_time: new Date(`1970-01-01T${e.target.value}`) });
                          }}
                          className="appearance-none bg-gray-100 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                  <div className="border-2 rounded-xl py-5">
                    <FieldGroup className="mx-auto max-w-xs flex-row">
                      <Field>
                        <FieldLabel htmlFor="date-picker-end">
                          Fecha de fin
                        </FieldLabel>
                        <Popover open={endOpen} onOpenChange={setEndOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              id="date-picker-end"
                              className="w-32 bg-gray-100 text-black justify-between font-normal"
                            >
                              {endDate ? format(endDate, "PPP") : "Select date"}
                              <ChevronDownIcon data-icon="inline-end" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={endDate}
                              captionLayout="dropdown"
                              defaultMonth={endDate}
                              onSelect={(date) => {
                                setEndDate(date);
                                setEventsDate({ ...eventsDate, end_date: date || new Date() });
                                setEndOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                      <Field className="w-32">
                        <FieldLabel htmlFor="time-picker-end">
                          Hora fin
                        </FieldLabel>
                        <Input
                          type="time"
                          id="time-picker-end"
                          step="1"
                          value={endTimeStr}
                          onChange={(e) => {
                            setEndTimeStr(e.target.value);
                            setEventsDate({ ...eventsDate, end_time: new Date(`1970-01-01T${e.target.value}`) });
                          }}
                          className="appearance-none bg-gray-100 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                  <FieldLabel className="mt-6 mb-3">
                    Identidad visual
                  </FieldLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/25 bg-muted/60 text-xs text-muted-foreground transition hover:border-primary hover:bg-primary/5"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <span className="rounded-full bg-primary/10 p-2 text-primary">
                          <ImagePlus className="size-5" />
                        </span>
                        <span>Sube una imagen o selecciona un icono</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Publicación */}
                <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={publishNow}
                      onClick={() => setPublishNow(!publishNow)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        publishNow ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`absolute top-1 size-4 rounded-full bg-primary-foreground shadow-sm transition ${
                          publishNow ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                    Publicar inmediatamente
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Evento'} <ChevronRight className="size-4" />
                  </button>
                </div>
              </section>

              {/* -------- Vista previa -------- */}
              <aside className="xl:sticky xl:top-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      Vista previa
                    </p>
                    <h2 className="mt-1 text-lg font-bold">
                      Así lo verán tus clientes
                    </h2>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    App móvil
                  </span>
                </div>

                <div className="mx-auto max-w-[320px] rounded-[3rem] border-[8px] border-foreground/10 bg-card p-2 shadow-2xl shadow-primary/10">
                  <div className="overflow-hidden rounded-[2.3rem] bg-gray-100">
                    {/* Barra de estado simulada */}
                    <div className="flex items-center justify-between px-5 pt-3 font-mono text-[9px] font-bold">
                      <span>9:41</span>
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-primary" />{" "}
                        <BatteryMedium />
                      </span>
                    </div>

                    <div className="px-4 pb-4 pt-6 bg-gray-100">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold">Descubre</h3>
                        <MapPin className="size-4 text-muted-foreground" />
                      </div>

                      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                        <div className="relative aspect-[1.65] overflow-hidden">
                          {eventsDate.event_image && (
                            <img
                              src={eventsDate.event_image}
                              alt="Interior de restaurante para el evento"
                              className="h-full w-full object-cover"
                            />
                          )}
                          <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-[9px] font-bold text-primary-foreground">
                            {selectedType}
                          </span>
                        </div>

                        <div className="p-3.5">
                          <h4 className="text-base font-bold leading-tight">
                            {eventsDate.name_events}
                          </h4>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
                            {eventsDate.description_events}
                          </p>
                          {eventsDate.conditions_events && (
                            <p className="mt-3 text-[10px] font-semibold text-primary">
                              {eventsDate.conditions_events}
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <CalendarDays className="size-3.5" /> Hoy · 20:00
                          </div>
                        </div>
                      </article>

                      <button
                        type="button"
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground"
                      >
                        Ver detalles <ChevronRight className="size-3.5" />
                      </button>

                      <div className="mx-auto mt-7 h-1 w-24 rounded-full bg-foreground/20" />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
