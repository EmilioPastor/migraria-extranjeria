"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingLibraryIcon,
  UserCircleIcon,
  BellAlertIcon,
  ArrowPathIcon,
  PaperClipIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  DocumentMagnifyingGlassIcon,
  ChevronRightIcon,
  LockClosedIcon,
  SparklesIcon,
  ArrowRightIcon,
  DocumentChartBarIcon,
  FolderIcon,
  MapPinIcon,
  UsersIcon,
  DocumentArrowUpIcon,
  AcademicCapIcon,
  ScaleIcon,
  IdentificationIcon,
  KeyIcon,
  EyeIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";
import PortalLayout from "@/components/portal/PortalLayout";
import CaseSteps from "@/components/portal/CaseSteps";
import DocumentUpload from "@/components/portal/DocumentUpload";
import NextSteps from "@/components/portal/NextSteps";
import PortalCTA from "@/components/portal/PortalCTA";

type CaseData = {
  id: string;
  tramite: string;
  tramite_key: string;
  status: "pending" | "in_review" | "favorable" | "not_favorable";
  message?: string | null;
  created_at?: string;
  updated_at?: string;
  case_number?: string;
  client_name?: string;
};

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'current' | 'completed';
};

export default function PortalPage() {
  const { token } = useParams<{ token: string }>();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'process' | 'contact'>('overview');

  useEffect(() => {
    console.log("🌐 FETCHING PORTAL CASE", token);

    if (!token) return;

    const loadCase = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/portal/case?token=${token}`, { 
          cache: "no-store",
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const json = await response.json();
        const data = json?.case ?? json;

        if (!response.ok || !data?.id) {
          throw new Error(json?.error || "Error cargando su expediente");
        }

        const enhancedData = {
          ...data,
          case_number: data.case_number || `MG-${data.id.slice(-8).toUpperCase()}`,
          client_name: data.client_name || "Estimado cliente"
        };

        setCaseData(enhancedData);
        setLastUpdated(new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }));
        
      } catch (e) {
        console.error("PORTAL ERROR:", e);
        setError(e instanceof Error ? e.message : "Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    loadCase();
    
    const interval = setInterval(() => {
      if (token && !loading) {
        loadCase();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const generateTimeline = (): TimelineEvent[] => {
    if (!caseData) return [];
    
    const baseTimeline: TimelineEvent[] = [
      {
        id: '1',
        date: caseData.created_at ? new Date(caseData.created_at).toLocaleDateString('es-ES') : 'Hoy',
        title: 'Inicio del Expediente',
        description: 'Creación y registro del expediente en nuestro sistema',
        icon: <DocumentTextIcon className="h-5 w-5" />,
        status: 'completed'
      },
      {
        id: '2',
        date: caseData.status !== 'pending' ? 'Completado' : 'En espera',
        title: 'Recepción de Documentación',
        description: 'Revisión y validación de documentación requerida',
        icon: <PaperClipIcon className="h-5 w-5" />,
        status: caseData.status !== 'pending' ? 'completed' : (caseData.status === 'pending' ? 'current' : 'pending')
      },
      {
        id: '3',
        date: caseData.status === 'in_review' || caseData.status === 'favorable' || caseData.status === 'not_favorable' 
          ? 'En progreso' 
          : 'Pendiente',
        title: 'Análisis Jurídico',
        description: 'Evaluación por nuestros especialistas en extranjería',
        icon: <DocumentMagnifyingGlassIcon className="h-5 w-5" />,
        status: caseData.status === 'in_review' ? 'current' : 
               (caseData.status === 'favorable' || caseData.status === 'not_favorable' ? 'completed' : 'pending')
      },
      {
        id: '4',
        date: caseData.status === 'favorable' || caseData.status === 'not_favorable' ? 'Completado' : 'Pendiente',
        title: 'Resolución Final',
        description: 'Comunicación del resultado y siguientes acciones',
        icon: caseData.status === 'favorable' ? <CheckCircleIcon className="h-5 w-5" /> : <DocumentChartBarIcon className="h-5 w-5" />,
        status: caseData.status === 'favorable' || caseData.status === 'not_favorable' ? 'completed' : 'pending'
      }
    ];

    return baseTimeline;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: <ClockIcon className="h-6 w-6" />,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        label: 'Documentación Pendiente',
        description: 'En espera de documentación requerida',
        gradient: 'from-amber-500 to-amber-600'
      },
      in_review: {
        icon: <DocumentMagnifyingGlassIcon className="h-6 w-6" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'En Revisión Jurídica',
        description: 'Analizando su documentación',
        gradient: 'from-blue-500 to-blue-600'
      },
      favorable: {
        icon: <CheckCircleIcon className="h-6 w-6" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        label: 'Resultado Favorable',
        description: 'Análisis completado con resultado positivo',
        gradient: 'from-emerald-500 to-emerald-600'
      },
      not_favorable: {
        icon: <XCircleIcon className="h-6 w-6" />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'Análisis Completado',
        description: 'Evaluación finalizada',
        gradient: 'from-gray-500 to-gray-600'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-white border-4 border-blue-100 flex items-center justify-center">
              <BuildingLibraryIcon className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Accediendo a su espacio personal</h2>
            <p className="text-gray-600">Cargando información del expediente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-white border-2 border-blue-200 flex items-center justify-center">
            <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Acceso no disponible</h2>
            <p className="text-gray-600">{error || "Expediente no encontrado"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(caseData.status);
  const timeline = generateTimeline();
  const step = caseData.status === "pending" ? 1 : 
               caseData.status === "in_review" ? 2 : 3;

  return (
    <PortalLayout
      title={`Portal Cliente - ${caseData.case_number}`}
      statusLabel={caseData.status}
    >
      {/* Header superior con identidad MIGRARIA */}
      <div className="border-b border-blue-100 pb-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-xl shadow-sm`}>
                <div className={statusConfig.color}>
                  {statusConfig.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{caseData.tramite}</h1>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
                    {statusConfig.label}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <KeyIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700 font-medium">ID: {caseData.case_number}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">Cliente: {caseData.client_name}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">Actualizado: {lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso del expediente</span>
                <span className="text-sm font-bold text-blue-600">{step}/3 pasos</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${statusConfig.gradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-1">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <DocumentChartBarIcon className="h-5 w-5" />
              Visión General
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'documents'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              Documentación
            </div>
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'process'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5" />
              Proceso
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'contact'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <BuildingLibraryIcon className="h-5 w-5" />
              Contacto
            </div>
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="space-y-8">
        
        {/* Mensaje destacado del equipo */}
        {caseData.message && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <BellAlertIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Mensaje del equipo de MIGRARIA</h3>
                  <span className="text-sm text-blue-600 font-medium">
                    {caseData.updated_at ? new Date(caseData.updated_at).toLocaleDateString('es-ES') : 'Hoy'}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{caseData.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tarjeta de estado */}
            <div className="bg-white border-2 border-gray-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Estado Detallado del Expediente</h2>
                  <p className="text-gray-600">Información actualizada y paso a paso</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <CaseSteps step={step} />
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué significa este estado?</h3>
                  <p className="text-gray-700 mb-4">
                    {caseData.status === 'pending' 
                      ? 'Su expediente está en fase inicial. Necesitamos su documentación para comenzar el análisis jurídico.'
                      : caseData.status === 'in_review'
                      ? 'Su documentación está siendo analizada por nuestro equipo de expertos en extranjería.'
                      : caseData.status === 'favorable'
                      ? '¡Excelentes noticias! Nuestro análisis indica que su caso tiene viabilidad.'
                      : 'Hemos completado el análisis de su situación. Contactaremos con usted para explicarle las opciones disponibles.'
                    }
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Transparencia total</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Cada paso del proceso es visible en su portal personal
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <LockClosedIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Confidencialidad</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Su información está protegida con cifrado de nivel bancario
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentación requerida */}
            {caseData.status === "pending" && caseData.tramite_key && (
              <div className="bg-white border-2 border-amber-100 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                    <DocumentArrowUpIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Documentación Requerida</h2>
                    <p className="text-gray-600">Complete su expediente para avanzar</p>
                  </div>
                </div>
                
                <DocumentUpload
                  caseId={caseData.id}
                  token={token}
                  tramite={caseData.tramite_key}
                />
                
                <div className="mt-8 pt-6 border-t border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-amber-600" />
                    Por qué es importante cada documento
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded mt-1">
                        <DocumentCheckIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Validamos la autenticidad y vigencia de cada documento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded mt-1">
                        <ScaleIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Cumplimos con todos los requisitos legales exigidos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded mt-1">
                        <IdentificationIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Garantizamos que su identidad está protegida en todo momento</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Siguientes pasos */}
            <div className="bg-white border-2 border-emerald-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
                  <ArrowRightIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Siguientes Pasos</h2>
                  <p className="text-gray-600">Lo que viene a continuación en su proceso</p>
                </div>
              </div>
              
              <NextSteps status={caseData.status} />
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-8">
            
            {/* Información del expediente */}
            <div className="bg-white border-2 border-gray-100 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Detalles del Expediente</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trámite Solicitado</p>
                  <p className="text-gray-900 font-semibold text-lg">{caseData.tramite}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fecha de Inicio</p>
                    <p className="text-gray-900 font-medium">
                      {caseData.created_at ? new Date(caseData.created_at).toLocaleDateString('es-ES') : 'No disponible'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Número de Expediente</p>
                    <p className="text-gray-900 font-medium">{caseData.case_number}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <LockClosedIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Espacio seguro verificado</p>
                      <p className="text-xs text-blue-600">Conexión encriptada SSL 256-bit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline del proceso */}
            <div className="bg-white border-2 border-gray-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Proceso de Gestión</h2>
                  <p className="text-gray-600">Seguimiento paso a paso</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-12">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-lg flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                      event.status === 'current' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                      'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      {event.icon}
                    </div>
                    
                    <div className={`pb-6 ${
                      event.id !== '4' ? 'border-l-2 border-gray-200 pl-6' : ''
                    }`}>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          event.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          event.status === 'current' ? 'bg-blue-50 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {event.date}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          event.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          event.status === 'current' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {event.status === 'completed' ? 'Completado' :
                           event.status === 'current' ? 'En curso' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contacto MIGRARIA */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BuildingLibraryIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">MIGRARIA Extranjería</h2>
                  <p className="text-blue-200">Su despacho de confianza</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Equipo asignado</p>
                      <p className="font-semibold">Departamento Legal</p>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="tel:+34912345678"
                  className="block p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-200">Teléfono</p>
                      <p className="font-semibold">+34 912 345 678</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 opacity-50 group-hover:opacity-100" />
                  </div>
                </a>
                
                <a 
                  href="mailto:info@migraria.es"
                  className="block p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      <EnvelopeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-200">Email</p>
                      <p className="font-semibold">info@migraria.es</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 opacity-50 group-hover:opacity-100" />
                  </div>
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="text-center">
                  <p className="text-sm text-blue-300 font-medium">Horario de atención:</p>
                  <p className="text-blue-200 font-semibold">Lunes a Viernes • 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Garantías MIGRARIA */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">¿Por qué confiar en MIGRARIA?</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Más de 15 años de experiencia especializada en derecho de extranjería nos avalan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <AcademicCapIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Expertos Especializados</h3>
              <p className="text-sm text-blue-200">
                Equipo jurídico dedicado exclusivamente a extranjería
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <ScaleIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Rigor Legal</h3>
              <p className="text-sm text-blue-200">
                Cumplimiento exhaustivo de toda normativa vigente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <IdentificationIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Confidencialidad Total</h3>
              <p className="text-sm text-blue-200">
                Protección de datos con certificación ISO 27001
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <MapPinIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Atención Personal</h3>
              <p className="text-sm text-blue-200">
                Asesoramiento individualizado para cada caso
              </p>
            </div>
          </div>
        </div>

        {/* CTA final */}
        {(caseData.status === "favorable" || caseData.status === "not_favorable") && (
          <div className="mt-8">
            <PortalCTA status={caseData.status} />
          </div>
        )}
      </div>
    </PortalLayout>
  );
}