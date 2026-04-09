'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserPreferredLanguage, getSupportedLanguages, isRTL } from './language-utils';

// Translation data for all supported languages
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    ourServices: 'Our Services',
    gallery: 'Gallery',
    contact: 'Contact',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    marketplace: 'Marketplace',
    auctions: 'Auctions',
    company: 'Company',
    news: 'News',
    careers: 'Careers',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    operatingSystem: 'Operating System',
    visitOperatingSystem: 'Visit Operating System',
    getOperatingSystem: 'Get Operating System',
    wallet: 'Wallet',
    helpSupport: 'Help & Support',
    loggedOutSuccessfully: 'Logged out successfully',
    failedToLogout: 'Failed to logout',
    
    // Company dropdown descriptions
    aboutDescription: 'Learn about our mission & values',
    contactDescription: 'Get in touch with our team',
    newsDescription: 'Stay updated with latest updates',
    careersDescription: 'Join our growing team',
    
    // OS dropdown descriptions
    galleryOSDescription: 'Manage your gallery operations see analytics and sell artworks',
    artistOSDescription: 'Showcase your artwork, track performance & earn royalties',
    collectorOSDescription: 'Discover, sell & collect amazing artworks',
    
    // Home page
    heroTitle: 'A DATA-DRIVEN, OPERATING SYSTEM FOR THE MODERN GALLERY.',
    heroSubtitle: 'Using Tech To Make Art Smarter',
    heroHeadline: 'Turning cultural spaces into data-driven marketplaces',
    heroHeadlinePart1: 'Turning',
    heroHeadlinePart2: 'cultural',
    heroHeadlinePart3a: 'spaces',
    heroHeadlinePart3b: 'into',
    heroHeadlinePart4: 'data-driven',
    heroHeadlinePart5: 'marketplaces',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: 'How',
    howItWorksTitle2: ' it ',
    howItWorksTitle3: 'works.',
    howItWorksStep1: 'Connect to ExhibitIQ',
    howItWorksStep2: 'Import your Artwork, Collectibles and/or Objects',
    howItWorksStep3: 'List on our Global, AI-powered Marketplace',
    
    heroTagline: 'Using Tech To Make Art Smarter',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    discoverArt: 'Discover Art',
    viewAll: 'View All',
    featuredArtists: 'Featured',
    featuredArtists2: 'Artists',
    featuredArtworks: 'Featured',
    featuredArtworks2: 'Artworks',
    exploreMarketplace: 'Explore Marketplace',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    theme: 'Theme',
    
    // Forms
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    country: 'Country',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    confirm: 'Confirm',
    areYouSure: 'Are you sure?',
    yes: 'Yes',
    no: 'No',
    
    // Art related
    artwork: 'Artwork',
    artist: 'Artist',
    title: 'Title',
    description: 'Description',
    medium: 'Medium',
    dimensions: 'Dimensions',
    year: 'Year',
    price: 'Price',
    category: 'Category',
    tags: 'Tags',
    
    // Gallery management
    inventory: 'Inventory',
    analytics: 'Analytics',
    visitors: 'Visitors',
    sales: 'Sales',
    events: 'Events',
    exhibitions: 'Exhibitions',
    
    // Footer
    copyright: '© 2026 Exo Sanctra. All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    support: 'Support',
    
    // Footer Sections
    legal: 'LEGAL',
    help: 'HELP',
    aboutUs: 'ABOUT US',
    services: 'SERVICES',
    careers: 'CAREERS',
    
    // Legal Section
    termsAndConditions: 'Terms and conditions',
    privacy: 'Privacy',
    security: 'Security',
    cookieSettings: 'Cookie settings',
    doNotSellPersonalInfo: 'Do not sell my personal information',
    
    // Help Section
    contactUs: 'Contact Us',
    helpCenter: 'Help Center',
    community: 'Community',
    
    // About Us Section
    whoWeAre: 'Who We Are',
    ourMission: 'Our Mission',
    ourValues: 'Our Values',
    
    // Services Section
    galleryOperatingSystem: 'Gallery Operating System',
    artFinance: 'Art Finance',
    storage: 'Storage',
    scanning3d2d: '3D/2D Scanning',
    
    // Careers Section
    internships: 'Internships',
    currentVacancies: 'Current Vacancies',
    artistPlacements: 'Artist Placements',
    engineers: 'Engineers',
    
    // Feature Cards
    poweredBy: 'Powered by',
    exhibitIQ: 'Exo Sanctra',
    featureCardsSubtitle: 'Discover the powerful tools that make Exo Sanctra an industry leader in luxury asset management.',
    
    // Home Page Hero Section
    manage: 'Manage',
    buy: 'Buy',
    and: 'and',
    sell: 'Sell',
    art: 'Art',
    all: 'All',
    in: 'in',
    inOnePlace: 'One Place.',
    sellFastSubtitle: 'Exo Sanctra is the platform for galleries, collectors, and institutions to manage collections, authenticate works, and trade art with trust.',
    
    // Global Marketplace
    globalMarketplace: 'GLOBAL MARKETPLACE',
    globalMarketplaceTitle: 'Connect with artist, galleries and collectors worldwide through our art marketplace.',
    marketplaceStats: 'Marketplace Stats',
    globalUsers: 'Global Users',
    countries: 'Countries',
    monthlySales: 'Monthly Sales',
    
    // Operating System
    operatingSystem: 'OPERATING SYSTEM',
    operatingSystemTitle: 'Complete art management system with inventory, analytics, and workflow automation.',
    artManagement: 'Art Management',
    totalArtworks: 'Total Artworks',
    activeCollections: 'Active Collections',
    automationTasks: 'Automation Tasks',
    
    // Instant Settlements
    instantSettlements: 'INSTANT SETTLEMENTS',
    instantSettlementsTitle: 'Receive and process payments without delay or friction for seamless transactions.',
    paymentProcessing: 'Payment Processing',
    instant: 'Instant',
    transactionSpeed: 'Transaction Speed',
    successRate: 'Success Rate',
    processingFee: 'Processing Fee',
    
    // Digital Walls
    digitalWalls: 'DIGITAL WALLS',
    digitalWallsTitle: 'Easily display or verify your art with QR code access and digital galleries.',
    qrCodeAccess: 'QR Code Access',
    activeQrCodes: 'Active QR Codes',
    scansToday: 'Scans Today',
    galleryViews: 'Gallery Views',
    
    // Digital Vault
    digitalVault: 'DIGITAL VAULT',
    digitalVaultTitle: 'Secure your digital assets with on-chain storage and premium access control.',
    digitalVaultAccess: 'Digital Vault Access',
    vaultId: 'Vault ID',
    securityStatus: 'Security Status',
    accessLevel: 'Access Level',
    protected: 'Protected',
    premium: 'Premium',
    
    // Price History
    priceHistory: 'PRICE HISTORY',
    priceHistoryTitle: 'Track and verify the price movement of every artwork with complete transparency.',
    artworkValuation: 'Artwork Valuation',
    currentValue: 'Current Value',
    purchasePrice: 'Purchase Price',
    appreciation: 'Appreciation',
    
    // Language names
    language: 'Language',
    english: 'English',
    chinese: 'Chinese',
    spanish: 'Spanish',
    french: 'French',
    arabic: 'Arabic',
    hindi: 'Hindi',
    dutch: 'Dutch',
  },
  
  zh: {
    // Navigation
    home: '首页',
    about: '关于',
    ourServices: '我们的服务',
    gallery: '画廊',
    contact: '联系',
    dashboard: '仪表板',
    profile: '个人资料',
    settings: '设置',
    logout: '退出',
    login: '登录',
    signup: '注册',
    marketplace: '市场',
    auctions: '拍卖',
    company: '公司',
    news: '新闻',
    careers: '职业',
    aboutUs: '关于我们',
    contactUs: '联系我们',
    operatingSystem: '操作系统',
    visitOperatingSystem: '访问操作系统',
    getOperatingSystem: '获取操作系统',
    wallet: '钱包',
    helpSupport: '帮助与支持',
    loggedOutSuccessfully: '已成功退出',
    failedToLogout: '退出失败',
    
    // Company dropdown descriptions
    aboutDescription: '了解我们的使命和价值观',
    contactDescription: '联系我们的团队',
    newsDescription: '了解最新动态',
    careersDescription: '加入我们不断壮大的团队',
    
    // OS dropdown descriptions
    galleryOSDescription: '管理您的画廊运营，查看分析并销售艺术品',
    artistOSDescription: '展示您的艺术品，跟踪表现并获得版税',
    collectorOSDescription: '发现、销售和收藏令人惊叹的艺术品',
    
    // Home page
    heroTitle: '现代画廊的数据驱动操作系统',
    heroSubtitle: '使用技术让艺术更智能',
    heroHeadline: '将文化空间转变为数据驱动的市场',
    heroHeadlinePart1: '将',
    heroHeadlinePart2: '文化',
    heroHeadlinePart3a: '空间',
    heroHeadlinePart3b: '转变为',
    heroHeadlinePart4: '数据驱动',
    heroHeadlinePart5: '的市场',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: '如何',
    howItWorksTitle2: '运作',
    howItWorksTitle3: '.',
    howItWorksStep1: '连接到 ExhibitIQ',
    howItWorksStep2: '导入您的艺术品、收藏品和/或物品',
    howItWorksStep3: '在我们的全球 AI 驱动市场上架',
    
    heroTagline: '使用技术让艺术更智能',
    getStarted: '开始使用',
    learnMore: '了解更多',
    discoverArt: '发现艺术',
    viewAll: '查看全部',
    featuredArtists: '特色艺术家',
    featuredArtworks: '特色艺术品',
    exploreMarketplace: '探索市场',
    
    // Common actions
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    remove: '移除',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    view: '查看',
    download: '下载',
    upload: '上传',
    theme: '主题',
    
    // Forms
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    firstName: '名字',
    lastName: '姓氏',
    phone: '电话',
    address: '地址',
    city: '城市',
    country: '国家',
    submit: '提交',
    loading: '加载中...',
    
    // Messages
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    confirm: '确认',
    areYouSure: '您确定吗？',
    yes: '是',
    no: '否',
    
    // Art related
    artwork: '艺术品',
    artist: '艺术家',
    title: '标题',
    description: '描述',
    medium: '媒介',
    dimensions: '尺寸',
    year: '年份',
    price: '价格',
    category: '类别',
    tags: '标签',
    
    // Gallery management
    inventory: '库存',
    analytics: '分析',
    visitors: '访客',
    sales: '销售',
    events: '活动',
    exhibitions: '展览',
    
    // Footer
    copyright: '© 2025 Exo Sanctra。保留所有权利。',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    support: '支持',
    
    // Footer Sections
    legal: '法律',
    help: '帮助',
    aboutUs: '关于我们',
    services: '服务',
    careers: '职业',
    
    // Legal Section
    termsAndConditions: '条款和条件',
    privacy: '隐私',
    security: '安全',
    cookieSettings: 'Cookie设置',
    doNotSellPersonalInfo: '不出售我的个人信息',
    
    // Help Section
    contactUs: '联系我们',
    helpCenter: '帮助中心',
    community: '社区',
    
    // About Us Section
    whoWeAre: '我们是谁',
    ourMission: '我们的使命',
    ourValues: '我们的价值观',
    
    // Services Section
    galleryOperatingSystem: '画廊操作系统',
    artFinance: '艺术金融',
    storage: '存储',
    scanning3d2d: '3D/2D扫描',
    
    // Careers Section
    internships: '实习',
    currentVacancies: '当前职位',
    artistPlacements: '艺术家安置',
    engineers: '工程师',
    
    // Feature Cards
    poweredBy: '由',
    exhibitIQ: 'Exo Sanctra',
    featureCardsSubtitle: '发现使Exo Sanctra成为艺术操作系统和管理的终极平台的强大工具',
    
    // Home Page Hero Section
    sellFast: '快速',
    fast: '销售',
    on: '在',
    sellFastSubtitle: '唯一的一体化平台，用于发展您的艺术业务、艺术品、收藏品和物品的销售和营销。',
    
    // Global Marketplace
    globalMarketplace: '全球市场',
    globalMarketplaceTitle: '通过我们的艺术市场与全球艺术家、画廊和收藏家建立联系。',
    marketplaceStats: '市场统计',
    globalUsers: '全球用户',
    countries: '国家',
    monthlySales: '月销售额',
    
    // Operating System
    operatingSystem: '操作系统',
    operatingSystemTitle: '完整的艺术管理系统，包括库存、分析和工作流自动化。',
    artManagement: '艺术管理',
    totalArtworks: '总艺术品',
    activeCollections: '活跃收藏',
    automationTasks: '自动化任务',
    
    // Instant Settlements
    instantSettlements: '即时结算',
    instantSettlementsTitle: '无延迟或无摩擦地接收和处理付款，实现无缝交易。',
    paymentProcessing: '支付处理',
    instant: '即时',
    transactionSpeed: '交易速度',
    successRate: '成功率',
    processingFee: '处理费',
    
    // Digital Walls
    digitalWalls: '数字墙',
    digitalWallsTitle: '通过二维码访问和数字画廊轻松展示或验证您的艺术。',
    qrCodeAccess: '二维码访问',
    activeQrCodes: '活跃二维码',
    scansToday: '今日扫描',
    galleryViews: '画廊访问',
    
    // Digital Vault
    digitalVault: '数字保险库',
    digitalVaultTitle: '通过链上存储和高级访问控制保护您的数字资产。',
    digitalVaultAccess: '数字保险库访问',
    vaultId: '保险库ID',
    securityStatus: '安全状态',
    accessLevel: '访问级别',
    protected: '受保护',
    premium: '高级',
    
    // Price History
    priceHistory: '价格历史',
    priceHistoryTitle: '跟踪并验证每件艺术品的价格变动，完全透明。',
    artworkValuation: '艺术品估值',
    currentValue: '当前价值',
    purchasePrice: '购买价格',
    appreciation: '增值',
    
    // Language names
    language: '语言',
    english: '英语',
    chinese: '中文',
    spanish: '西班牙语',
    french: '法语',
    arabic: '阿拉伯语',
    hindi: '印地语',
    dutch: '荷兰语',
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    about: 'Acerca de',
    ourServices: 'Nuestros Servicios',
    gallery: 'Galería',
    contact: 'Contacto',
    dashboard: 'Panel',
    profile: 'Perfil',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    marketplace: 'Mercado',
    auctions: 'Subastas',
    company: 'Empresa',
    news: 'Noticias',
    careers: 'Carreras',
    aboutUs: 'Sobre Nosotros',
    contactUs: 'Contáctanos',
    operatingSystem: 'Sistema Operativo',
    visitOperatingSystem: 'Visitar Sistema Operativo',
    getOperatingSystem: 'Obtener Sistema Operativo',
    wallet: 'Billetera',
    helpSupport: 'Ayuda y Soporte',
    loggedOutSuccessfully: 'Sesión cerrada exitosamente',
    failedToLogout: 'Error al cerrar sesión',
    
    // Company dropdown descriptions
    aboutDescription: 'Conoce nuestra misión y valores',
    contactDescription: 'Ponte en contacto con nuestro equipo',
    newsDescription: 'Mantente actualizado con las últimas novedades',
    careersDescription: 'Únete a nuestro equipo en crecimiento',
    
    // OS dropdown descriptions
    galleryOSDescription: 'Gestiona las operaciones de tu galería, ve análisis y vende arte',
    artistOSDescription: 'Muestra tu obra de arte, rastrea el rendimiento y gana regalías',
    collectorOSDescription: 'Descubre, vende y colecciona obras de arte increíbles',
    
    // Home page
    heroTitle: 'UN SISTEMA OPERATIVO IMPULSADO POR DATOS PARA LA GALERÍA MODERNA.',
    heroSubtitle: 'Usando Tecnología Para Hacer el Arte Más Inteligente',
    heroHeadline: 'Transformando espacios culturales en mercados impulsados por datos',
    heroHeadlinePart1: 'Transformando',
    heroHeadlinePart2: 'espacios',
    heroHeadlinePart3a: 'culturales',
    heroHeadlinePart3b: 'en',
    heroHeadlinePart4: 'mercados',
    heroHeadlinePart5: 'impulsados por datos',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: 'Cómo',
    howItWorksTitle2: ' funciona',
    howItWorksTitle3: '.',
    howItWorksStep1: 'Conecta con ExhibitIQ',
    howItWorksStep2: 'Importa tu Arte, Coleccionables y/u Objetos',
    howItWorksStep3: 'Lista en nuestro mercado global impulsado por IA',
    
    heroTagline: 'Usando Tecnología Para Hacer el Arte Más Inteligente',
    getStarted: 'Comenzar',
    learnMore: 'Saber más',
    discoverArt: 'Descubrir Arte',
    viewAll: 'Ver Todo',
    featuredArtists: 'Artistas Destacados',
    featuredArtworks: 'Obras Destacadas',
    exploreMarketplace: 'Explorar Mercado',
    
    // Common actions
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    remove: 'Quitar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    view: 'Ver',
    download: 'Descargar',
    upload: 'Subir',
    theme: 'Tema',
    
    // Forms
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
    address: 'Dirección',
    city: 'Ciudad',
    country: 'País',
    submit: 'Enviar',
    loading: 'Cargando...',
    
    // Messages
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    confirm: 'Confirmar',
    areYouSure: '¿Estás seguro?',
    yes: 'Sí',
    no: 'No',
    
    // Art related
    artwork: 'Obra de arte',
    artist: 'Artista',
    title: 'Título',
    description: 'Descripción',
    medium: 'Medio',
    dimensions: 'Dimensiones',
    year: 'Año',
    price: 'Precio',
    category: 'Categoría',
    tags: 'Etiquetas',
    
    // Gallery management
    inventory: 'Inventario',
    analytics: 'Análisis',
    visitors: 'Visitantes',
    sales: 'Ventas',
    events: 'Eventos',
    exhibitions: 'Exposiciones',
    
    // Footer
    copyright: '© 2026 Exo Sanctra. Todos los derechos reservados.',
    privacyPolicy: 'Política de privacidad',
    termsOfService: 'Términos de servicio',
    support: 'Soporte',
    
    // Footer Sections
    legal: 'LEGAL',
    help: 'AYUDA',
    aboutUs: 'SOBRE NOSOTROS',
    services: 'SERVICIOS',
    careers: 'CARRERAS',
    
    // Legal Section
    termsAndConditions: 'Términos y condiciones',
    privacy: 'Privacidad',
    security: 'Seguridad',
    cookieSettings: 'Configuración de cookies',
    doNotSellPersonalInfo: 'No vender mi información personal',
    
    // Help Section
    contactUs: 'Contáctanos',
    helpCenter: 'Centro de Ayuda',
    community: 'Comunidad',
    
    // About Us Section
    whoWeAre: 'Quiénes Somos',
    ourMission: 'Nuestra Misión',
    ourValues: 'Nuestros Valores',
    
    // Services Section
    galleryOperatingSystem: 'Sistema Operativo de Galería',
    artFinance: 'Finanzas de Arte',
    storage: 'Almacenamiento',
    scanning3d2d: 'Escaneo 3D/2D',
    
    // Careers Section
    internships: 'Pasantías',
    currentVacancies: 'Vacantes Actuales',
    artistPlacements: 'Colocaciones de Artistas',
    engineers: 'Ingenieros',
    
    // Feature Cards
    poweredBy: 'Impulsado por',
    exhibitIQ: 'ExhibitIQ',
    featureCardsSubtitle: 'Descubre las poderosas herramientas que hacen de Exo Sanctra la plataforma definitiva para el sistema operativo y gestión del arte',
    
    // Home Page Hero Section
    sellFast: 'Vende',
    fast: 'Rápido',
    on: 'en',
    sellFastSubtitle: 'La única plataforma todo en uno para hacer crecer tu negocio de arte, ventas y marketing de arte, coleccionables y objetos.',
    
    // Global Marketplace
    globalMarketplace: 'MERCADO GLOBAL',
    globalMarketplaceTitle: 'Conéctate con artistas, galerías y coleccionistas de todo el mundo a través de nuestro mercado de arte.',
    marketplaceStats: 'Estadísticas del Mercado',
    globalUsers: 'Usuarios Globales',
    countries: 'Países',
    monthlySales: 'Ventas Mensuales',
    
    // Operating System
    operatingSystem: 'SISTEMA OPERATIVO',
    operatingSystemTitle: 'Sistema completo de gestión de arte con inventario, análisis y automatización de flujo de trabajo.',
    artManagement: 'Gestión de Arte',
    totalArtworks: 'Total de Obras',
    activeCollections: 'Colecciones Activas',
    automationTasks: 'Tareas Automatizadas',
    
    // Instant Settlements
    instantSettlements: 'LIQUIDACIONES INSTANTÁNEAS',
    instantSettlementsTitle: 'Recibe y procesa pagos sin demora ni fricción para transacciones sin problemas.',
    paymentProcessing: 'Procesamiento de Pagos',
    instant: 'Instantáneo',
    transactionSpeed: 'Velocidad de Transacción',
    successRate: 'Tasa de Éxito',
    processingFee: 'Tarifa de Procesamiento',
    
    // Digital Walls
    digitalWalls: 'PAREDES DIGITALES',
    digitalWallsTitle: 'Muestra o verifica fácilmente tu arte con acceso de código QR y galerías digitales.',
    qrCodeAccess: 'Acceso de Código QR',
    activeQrCodes: 'Códigos QR Activos',
    scansToday: 'Escaneos Hoy',
    galleryViews: 'Vistas de Galería',
    
    // Digital Vault
    digitalVault: 'BÓVEDA DIGITAL',
    digitalVaultTitle: 'Asegura tus activos digitales con almacenamiento en cadena y control de acceso premium.',
    digitalVaultAccess: 'Acceso a Bóveda Digital',
    vaultId: 'ID de Bóveda',
    securityStatus: 'Estado de Seguridad',
    accessLevel: 'Nivel de Acceso',
    protected: 'Protegido',
    premium: 'Premium',
    
    // Price History
    priceHistory: 'HISTORIAL DE PRECIOS',
    priceHistoryTitle: 'Rastrea y verifica el movimiento de precios de cada obra de arte con total transparencia.',
    artworkValuation: 'Valoración de Obra',
    currentValue: 'Valor Actual',
    purchasePrice: 'Precio de Compra',
    appreciation: 'Apreciación',
    
    // Language names
    language: 'Idioma',
    english: 'Inglés',
    chinese: 'Chino',
    spanish: 'Español',
    french: 'Francés',
    arabic: 'Árabe',
    hindi: 'Hindi',
    dutch: 'Holandés',
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    services: 'Services',
    gallery: 'Galerie',
    contact: 'Contact',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    signup: 'S\'inscrire',
    marketplace: 'Marché',
    auctions: 'Enchères',
    company: 'Entreprise',
    news: 'Actualités',
    careers: 'Carrières',
    aboutUs: 'À Propos de Nous',
    contactUs: 'Contactez-nous',
    operatingSystem: 'Système d\'Exploitation',
    visitOperatingSystem: 'Visiter le Système d\'Exploitation',
    getOperatingSystem: 'Obtenir le Système d\'Exploitation',
    wallet: 'Portefeuille',
    helpSupport: 'Aide et Support',
    loggedOutSuccessfully: 'Déconnexion réussie',
    failedToLogout: 'Échec de la déconnexion',
    
    // Company dropdown descriptions
    aboutDescription: 'Découvrez notre mission et nos valeurs',
    contactDescription: 'Contactez notre équipe',
    newsDescription: 'Restez informé des dernières actualités',
    careersDescription: 'Rejoignez notre équipe en pleine croissance',
    
    // OS dropdown descriptions
    galleryOSDescription: 'Gérez les opérations de votre galerie, consultez les analyses et vendez des œuvres d\'art',
    artistOSDescription: 'Présentez vos œuvres d\'art, suivez les performances et gagnez des redevances',
    collectorOSDescription: 'Découvrez, vendez et collectionnez des œuvres d\'art incroyables',
    
    // Home page
    heroTitle: 'UN SYSTÈME D\'EXPLOITATION PILOTÉ PAR LES DONNÉES POUR LA GALERIE MODERNE.',
    heroSubtitle: 'Utiliser la Technologie Pour Rendre l\'Art Plus Intelligent',
    heroHeadline: 'Transformer les espaces culturels en marchés pilotés par les données',
    heroHeadlinePart1: 'Transformer',
    heroHeadlinePart2: 'les',
    heroHeadlinePart3a: 'espaces culturels',
    heroHeadlinePart3b: 'en',
    heroHeadlinePart4: 'marchés',
    heroHeadlinePart5: 'pilotés par les données',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: 'Comment',
    howItWorksTitle2: ' ça ',
    howItWorksTitle3: 'fonctionne.',
    howItWorksStep1: 'Connectez-vous à ExhibitIQ',
    howItWorksStep2: 'Importez vos Œuvres d\'Art, Collectionnables et/ou Objets',
    howItWorksStep3: 'Listez sur notre marché global alimenté par l\'IA',
    
    heroTagline: 'Utiliser la Technologie Pour Rendre l\'Art Plus Intelligent',
    getStarted: 'Commencer',
    learnMore: 'En savoir plus',
    discoverArt: 'Découvrir l\'Art',
    viewAll: 'Voir Tout',
    featuredArtists: 'Artistes en Vedette',
    featuredArtworks: 'Œuvres en Vedette',
    exploreMarketplace: 'Explorer le Marché',
    
    // Common actions
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    remove: 'Supprimer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    view: 'Voir',
    download: 'Télécharger',
    upload: 'Téléverser',
    theme: 'Thème',
    
    // Forms
    email: 'E-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    phone: 'Téléphone',
    address: 'Adresse',
    city: 'Ville',
    country: 'Pays',
    submit: 'Soumettre',
    loading: 'Chargement...',
    
    // Messages
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
    info: 'Information',
    confirm: 'Confirmer',
    areYouSure: 'Êtes-vous sûr?',
    yes: 'Oui',
    no: 'Non',
    
    // Art related
    artwork: 'Œuvre d\'art',
    artist: 'Artiste',
    title: 'Titre',
    description: 'Description',
    medium: 'Médium',
    dimensions: 'Dimensions',
    year: 'Année',
    price: 'Prix',
    category: 'Catégorie',
    tags: 'Balises',
    
    // Gallery management
    inventory: 'Inventaire',
    analytics: 'Analyses',
    visitors: 'Visiteurs',
    sales: 'Ventes',
    events: 'Événements',
    exhibitions: 'Expositions',
    
    // Footer
    copyright: '© 2026 Exo Sanctra. All rights reserved.',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions de service',
    support: 'Support',
    
    // Footer Sections
    legal: 'LÉGAL',
    help: 'AIDE',
    aboutUs: 'À PROPOS DE NOUS',
    services: 'SERVICES',
    careers: 'CARRIÈRES',
    
    // Legal Section
    termsAndConditions: 'Termes et conditions',
    privacy: 'Confidentialité',
    security: 'Sécurité',
    cookieSettings: 'Paramètres des cookies',
    doNotSellPersonalInfo: 'Ne pas vendre mes informations personnelles',
    
    // Help Section
    contactUs: 'Contactez-nous',
    helpCenter: 'Centre d\'aide',
    community: 'Communauté',
    
    // About Us Section
    whoWeAre: 'Qui nous sommes',
    ourMission: 'Notre mission',
    ourValues: 'Nos valeurs',
    
    // Services Section
    galleryOperatingSystem: 'Système d\'exploitation de galerie',
    artFinance: 'Finance d\'art',
    storage: 'Stockage',
    scanning3d2d: 'Numérisation 3D/2D',
    
    // Careers Section
    internships: 'Stages',
    currentVacancies: 'Postes vacants actuels',
    artistPlacements: 'Placements d\'artistes',
    engineers: 'Ingénieurs',
    
    // Feature Cards
    poweredBy: 'Propulsé par',
    exhibitIQ: 'Exo Sanctra',
    featureCardsSubtitle: 'Découvrez les outils puissants qui font d\'Exo Sanctra la plateforme ultime pour le système d\'exploitation et la gestion de l\'art',
    
    // Home Page Hero Section
    sellFast: 'Vendez',
    fast: 'Rapide',
    on: 'sur',
    sellFastSubtitle: 'La seule plateforme tout-en-un pour développer votre entreprise d\'art, les ventes et le marketing d\'art, de collection et d\'objets.',
    
    // Global Marketplace
    globalMarketplace: 'MARCHÉ MONDIAL',
    globalMarketplaceTitle: 'Connectez-vous avec des artistes, des galeries et des collectionneurs du monde entier grâce à notre marché d\'art.',
    marketplaceStats: 'Statistiques du Marché',
    globalUsers: 'Utilisateurs Mondiaux',
    countries: 'Pays',
    monthlySales: 'Ventes Mensuelles',
    
    // Operating System
    operatingSystem: 'SYSTÈME D\'EXPLOITATION',
    operatingSystemTitle: 'Système complet de gestion d\'art avec inventaire, analyses et automatisation des flux de travail.',
    artManagement: 'Gestion d\'Art',
    totalArtworks: 'Total des Œuvres',
    activeCollections: 'Collections Actives',
    automationTasks: 'Tâches Automatisées',
    
    // Instant Settlements
    instantSettlements: 'RÈGLEMENTS INSTANTANÉS',
    instantSettlementsTitle: 'Recevez et traitez les paiements sans délai ni friction pour des transactions transparentes.',
    paymentProcessing: 'Traitement des Paiements',
    instant: 'Instantané',
    transactionSpeed: 'Vitesse de Transaction',
    successRate: 'Taux de Réussite',
    processingFee: 'Frais de Traitement',
    
    // Digital Walls
    digitalWalls: 'MURS NUMÉRIQUES',
    digitalWallsTitle: 'Affichez ou vérifiez facilement votre art avec un accès par code QR et des galeries numériques.',
    qrCodeAccess: 'Accès par Code QR',
    activeQrCodes: 'Codes QR Actifs',
    scansToday: 'Scans Aujourd\'hui',
    galleryViews: 'Vues de Galerie',
    
    // Digital Vault
    digitalVault: 'COFFRE-FORT NUMÉRIQUE',
    digitalVaultTitle: 'Sécurisez vos actifs numériques avec un stockage en chaîne et un contrôle d\'accès premium.',
    digitalVaultAccess: 'Accès au Coffre-Fort Numérique',
    vaultId: 'ID du Coffre-Fort',
    securityStatus: 'Statut de Sécurité',
    accessLevel: 'Niveau d\'Accès',
    protected: 'Protégé',
    premium: 'Premium',
    
    // Price History
    priceHistory: 'HISTORIQUE DES PRIX',
    priceHistoryTitle: 'Suivez et vérifiez le mouvement des prix de chaque œuvre d\'art avec une transparence totale.',
    artworkValuation: 'Évaluation d\'Œuvre',
    currentValue: 'Valeur Actuelle',
    purchasePrice: 'Prix d\'Achat',
    appreciation: 'Appréciation',
    
    // Language names
    language: 'Langue',
    english: 'Anglais',
    chinese: 'Chinois',
    spanish: 'Espagnol',
    french: 'Français',
    arabic: 'Arabe',
    hindi: 'Hindi',
    dutch: 'Néerlandais',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'حول',
    services: 'الخدمات',
    gallery: 'المعرض',
    contact: 'اتصل بنا',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    marketplace: 'السوق',
    auctions: 'المزادات',
    company: 'الشركة',
    news: 'الأخبار',
    careers: 'الوظائف',
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    operatingSystem: 'نظام التشغيل',
    visitOperatingSystem: 'زيارة نظام التشغيل',
    getOperatingSystem: 'الحصول على نظام التشغيل',
    wallet: 'المحفظة',
    helpSupport: 'المساعدة والدعم',
    loggedOutSuccessfully: 'تم تسجيل الخروج بنجاح',
    failedToLogout: 'فشل في تسجيل الخروج',
    
    // Company dropdown descriptions
    aboutDescription: 'تعرف على مهمتنا وقيمنا',
    contactDescription: 'تواصل مع فريقنا',
    newsDescription: 'ابق على اطلاع بأحدث التحديثات',
    careersDescription: 'انضم إلى فريقنا المتزايد',
    
    // OS dropdown descriptions
    galleryOSDescription: 'إدارة عمليات معرضك، رؤية التحليلات وبيع الفنون',
    artistOSDescription: 'عرض أعمالك الفنية، تتبع الأداء وكسب الإتاوات',
    collectorOSDescription: 'اكتشف وبيع واجمع الأعمال الفنية المذهلة',
    
    // Home page
    heroTitle: 'نظام تشغيل مدفوع بالبيانات للمعرض الحديث',
    heroSubtitle: 'استخدام التكنولوجيا لجعل الفن أكثر ذكاءً',
    heroHeadline: 'تحويل المساحات الثقافية إلى أسواق مدفوعة بالبيانات',
    heroHeadlinePart1: 'تحويل',
    heroHeadlinePart2: 'المساحات',
    heroHeadlinePart3a: 'الثقافية',
    heroHeadlinePart3b: 'إلى',
    heroHeadlinePart4: 'أسواق',
    heroHeadlinePart5: 'مدفوعة بالبيانات',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: 'كيف',
    howItWorksTitle2: ' يعمل',
    howItWorksTitle3: '.',
    howItWorksStep1: 'اتصل بـ ExhibitIQ',
    howItWorksStep2: 'استورد أعمالك الفنية والمقتنيات و/أو الأشياء',
    howItWorksStep3: 'اعرض في سوقنا العالمي المدعوم بالذكاء الاصطناعي',
    
    heroTagline: 'استخدام التكنولوجيا لجعل الفن أكثر ذكاءً',
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    discoverArt: 'اكتشف الفن',
    viewAll: 'عرض الكل',
    featuredArtists: 'الفنانون المميزون',
    featuredArtworks: 'الأعمال الفنية المميزة',
    exploreMarketplace: 'استكشف السوق',
    
    // Common actions
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    add: 'إضافة',
    remove: 'إزالة',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    view: 'عرض',
    download: 'تحميل',
    upload: 'رفع',
    theme: 'المظهر',
    
    // Forms
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    country: 'البلد',
    submit: 'إرسال',
    loading: 'جاري التحميل...',
    
    // Messages
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    confirm: 'تأكيد',
    areYouSure: 'هل أنت متأكد؟',
    yes: 'نعم',
    no: 'لا',
    
    // Art related
    artwork: 'العمل الفني',
    artist: 'الفنان',
    title: 'العنوان',
    description: 'الوصف',
    medium: 'الوسيط',
    dimensions: 'الأبعاد',
    year: 'السنة',
    price: 'السعر',
    category: 'الفئة',
    tags: 'العلامات',
    
    // Gallery management
    inventory: 'المخزون',
    analytics: 'التحليلات',
    visitors: 'الزوار',
    sales: 'المبيعات',
    events: 'الأحداث',
    exhibitions: 'المعارض',
    
    // Footer
    copyright: '© 2026 Exo Sanctra. جميع الحقوق محفوظة.',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    support: 'الدعم',
    
    // Footer Sections
    legal: 'قانوني',
    help: 'مساعدة',
    aboutUs: 'من نحن',
    services: 'الخدمات',
    careers: 'الوظائف',
    
    // Legal Section
    termsAndConditions: 'الشروط والأحكام',
    privacy: 'الخصوصية',
    security: 'الأمان',
    cookieSettings: 'إعدادات ملفات تعريف الارتباط',
    doNotSellPersonalInfo: 'عدم بيع معلوماتي الشخصية',
    
    // Help Section
    contactUs: 'اتصل بنا',
    helpCenter: 'مركز المساعدة',
    community: 'المجتمع',
    
    // About Us Section
    whoWeAre: 'من نحن',
    ourMission: 'مهمتنا',
    ourValues: 'قيمنا',
    
    // Services Section
    galleryOperatingSystem: 'نظام تشغيل المعرض',
    artFinance: 'تمويل الفن',
    storage: 'التخزين',
    scanning3d2d: 'المسح الضوئي ثلاثي الأبعاد/ثنائي الأبعاد',
    
    // Careers Section
    internships: 'التدريب',
    currentVacancies: 'الوظائف الشاغرة الحالية',
    artistPlacements: 'تنسيقات الفنانين',
    engineers: 'المهندسين',
    
    // Feature Cards
    poweredBy: 'مدعوم بواسطة',
    exhibitIQ: 'Exo Sanctra',
    featureCardsSubtitle: 'اكتشف الأدوات القوية التي تجعل Exo Sanctra المنصة النهائية لنظام تشغيل الفن وإدارته',
    
    // Home Page Hero Section
    sellFast: 'بيع',
    fast: 'سريع',
    on: 'على',
    sellFastSubtitle: 'المنصة الوحيدة الشاملة لتنمية عملك الفني ومبيعات وتسويق الفن والتحف والأشياء.',
    
    // Global Marketplace
    globalMarketplace: 'السوق العالمية',
    globalMarketplaceTitle: 'تواصل مع الفنانين والمعارض والجامعين في جميع أنحاء العالم من خلال سوق الفن لدينا.',
    marketplaceStats: 'إحصائيات السوق',
    globalUsers: 'المستخدمون العالميون',
    countries: 'الدول',
    monthlySales: 'المبيعات الشهرية',
    
    // Operating System
    operatingSystem: 'نظام التشغيل',
    operatingSystemTitle: 'نظام إدارة الفن الكامل مع المخزون والتحليلات وأتمتة سير العمل.',
    artManagement: 'إدارة الفن',
    totalArtworks: 'إجمالي الأعمال الفنية',
    activeCollections: 'المجموعات النشطة',
    automationTasks: 'المهام المؤتمتة',
    
    // Instant Settlements
    instantSettlements: 'التسويات الفورية',
    instantSettlementsTitle: 'استلم واعالج المدفوعات بدون تأخير أو احتكاك للمعاملات السلسة.',
    paymentProcessing: 'معالجة المدفوعات',
    instant: 'فوري',
    transactionSpeed: 'سرعة المعاملة',
    successRate: 'معدل النجاح',
    processingFee: 'رسوم المعالجة',
    
    // Digital Walls
    digitalWalls: 'الجدران الرقمية',
    digitalWallsTitle: 'اعرض أو تحقق من فنك بسهولة مع الوصول برمز QR والمعارض الرقمية.',
    qrCodeAccess: 'الوصول برمز QR',
    activeQrCodes: 'رموز QR النشطة',
    scansToday: 'عمليات المسح اليوم',
    galleryViews: 'مشاهدات المعرض',
    
    // Digital Vault
    digitalVault: 'الخزنة الرقمية',
    digitalVaultTitle: 'أمن أصولك الرقمية مع التخزين على السلسلة والتحكم في الوصول المميز.',
    digitalVaultAccess: 'الوصول للخزنة الرقمية',
    vaultId: 'معرف الخزنة',
    securityStatus: 'حالة الأمان',
    accessLevel: 'مستوى الوصول',
    protected: 'محمي',
    premium: 'مميز',
    
    // Price History
    priceHistory: 'تاريخ الأسعار',
    priceHistoryTitle: 'تتبع وتحقق من حركة أسعار كل عمل فني بشفافية كاملة.',
    artworkValuation: 'تقييم العمل الفني',
    currentValue: 'القيمة الحالية',
    purchasePrice: 'سعر الشراء',
    appreciation: 'التقدير',
    
    // Language names
    language: 'اللغة',
    english: 'الإنجليزية',
    chinese: 'الصينية',
    spanish: 'الإسبانية',
    french: 'الفرنسية',
    arabic: 'العربية',
    hindi: 'الهندية',
    dutch: 'الهولندية',
  },
  
  hi: {
    // Navigation
    home: 'होम',
    about: 'के बारे में',
    services: 'सेवाएं',
    gallery: 'गैलरी',
    contact: 'संपर्क',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    signup: 'साइन अप',
    marketplace: 'बाजार',
    auctions: 'नीलामी',
    company: 'कंपनी',
    news: 'समाचार',
    careers: 'करियर',
    aboutUs: 'हमारे बारे में',
    contactUs: 'संपर्क करें',
    operatingSystem: 'ऑपरेटिंग सिस्टम',
    visitOperatingSystem: 'ऑपरेटिंग सिस्टम देखें',
    getOperatingSystem: 'ऑपरेटिंग सिस्टम प्राप्त करें',
    wallet: 'वॉलेट',
    helpSupport: 'सहायता और समर्थन',
    loggedOutSuccessfully: 'सफलतापूर्वक लॉगआउट',
    failedToLogout: 'लॉगआउट में विफल',
    
    // Company dropdown descriptions
    aboutDescription: 'हमारे मिशन और मूल्यों के बारे में जानें',
    contactDescription: 'हमारी टीम से संपर्क करें',
    newsDescription: 'नवीनतम अपडेट के साथ अपडेट रहें',
    careersDescription: 'हमारी बढ़ती टीम में शामिल हों',
    
    // OS dropdown descriptions
    galleryOSDescription: 'अपने गैलरी संचालन का प्रबंधन करें, विश्लेषण देखें और कला बेचें',
    artistOSDescription: 'अपनी कलाकृतियों को प्रदर्शित करें, प्रदर्शन ट्रैक करें और रॉयल्टी कमाएं',
    collectorOSDescription: 'अद्भुत कलाकृतियों की खोज, बिक्री और संग्रह करें',
    
    // Home page
    heroTitle: 'आधुनिक गैलरी के लिए डेटा-संचालित ऑपरेटिंग सिस्टम',
    heroSubtitle: 'कला को और भी स्मार्ट बनाने के लिए तकनीक का उपयोग',
    heroHeadline: 'सांस्कृतिक स्थानों को डेटा-संचालित बाजारों में बदलना',
    heroHeadlinePart1: 'सांस्कृतिक',
    heroHeadlinePart2: 'स्थानों',
    heroHeadlinePart3a: 'को',
    heroHeadlinePart3b: 'डेटा-संचालित',
    heroHeadlinePart4: 'बाजारों',
    heroHeadlinePart5: 'में बदलना',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: 'कैसे',
    howItWorksTitle2: ' काम',
    howItWorksTitle3: 'करता है.',
    howItWorksStep1: 'Exo Sanctra से कनेक्ट करें',
    howItWorksStep2: 'अपनी कलाकृतियां, संग्रहणीय वस्तुएं और/या वस्तुएं आयात करें',
    howItWorksStep3: 'हमारे वैश्विक, AI-संचालित बाजार में सूचीबद्ध करें',
    
    heroTagline: 'कला को और भी स्मार्ट बनाने के लिए तकनीक का उपयोग',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    discoverArt: 'कला खोजें',
    viewAll: 'सभी देखें',
    featuredArtists: 'विशेष कलाकार',
    featuredArtworks: 'विशेष कलाकृतियां',
    exploreMarketplace: 'बाजार का अन्वेषण करें',
    
    // Common actions
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    add: 'जोड़ें',
    remove: 'हटाएं',
    search: 'खोजें',
    filter: 'फ़िल्टर करें',
    sort: 'क्रमबद्ध करें',
    view: 'देखें',
    download: 'डाउनलोड करें',
    upload: 'अपलोड करें',
    theme: 'थीम',
    
    // Forms
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    phone: 'फ़ोन',
    address: 'पता',
    city: 'शहर',
    country: 'देश',
    submit: 'सबमिट करें',
    loading: 'लोड हो रहा है...',
    
    // Messages
    success: 'सफलता',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी',
    confirm: 'पुष्टि करें',
    areYouSure: 'क्या आप निश्चित हैं?',
    yes: 'हाँ',
    no: 'नहीं',
    
    // Art related
    artwork: 'कलाकृति',
    artist: 'कलाकार',
    title: 'शीर्षक',
    description: 'विवरण',
    medium: 'माध्यम',
    dimensions: 'आयाम',
    year: 'वर्ष',
    price: 'मूल्य',
    category: 'श्रेणी',
    tags: 'टैग',
    
    // Gallery management
    inventory: 'इन्वेंटरी',
    analytics: 'विश्लेषण',
    visitors: 'आगंतुक',
    sales: 'बिक्री',
    events: 'कार्यक्रम',
    exhibitions: 'प्रदर्शनियां',
    
    // Footer
    copyright: '© 2025 Exo Sanctra। सर्वाधिकार सुरक्षित।',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    support: 'समर्थन',
    
    // Footer Sections
    legal: 'कानूनी',
    help: 'सहायता',
    aboutUs: 'हमारे बारे में',
    services: 'सेवाएं',
    careers: 'करियर',
    
    // Legal Section
    termsAndConditions: 'नियम और शर्तें',
    privacy: 'गोपनीयता',
    security: 'सुरक्षा',
    cookieSettings: 'कुकी सेटिंग्स',
    doNotSellPersonalInfo: 'मेरी व्यक्तिगत जानकारी न बेचें',
    
    // Help Section
    contactUs: 'संपर्क करें',
    helpCenter: 'सहायता केंद्र',
    community: 'समुदाय',
    
    // About Us Section
    whoWeAre: 'हम कौन हैं',
    ourMission: 'हमारा मिशन',
    ourValues: 'हमारे मूल्य',
    
    // Services Section
    galleryOperatingSystem: 'गैलरी ऑपरेटिंग सिस्टम',
    artFinance: 'कला वित्त',
    storage: 'भंडारण',
    scanning3d2d: '3D/2D स्कैनिंग',
    
    // Careers Section
    internships: 'इंटर्नशिप',
    currentVacancies: 'वर्तमान रिक्तियां',
    artistPlacements: 'कलाकार प्लेसमेंट',
    engineers: 'इंजीनियर',
    
    // Feature Cards
    poweredBy: 'द्वारा संचालित',
    exhibitIQ: 'ExhibitIQ',
    featureCardsSubtitle: 'उन शक्तिशाली उपकरणों की खोज करें जो ExhibitIQ को कला ऑपरेटिंग सिस्टम और प्रबंधन के लिए अंतिम मंच बनाते हैं',
    
    // Home Page Hero Section
    sellFast: 'तेजी से',
    fast: 'बेचें',
    on: 'पर',
    sellFastSubtitle: 'अपने कला व्यवसाय, कला, संग्रहणीय और वस्तुओं की बिक्री और विपणन को बढ़ाने के लिए एकमात्र ऑल-इन-वन प्लेटफॉर्म।',
    
    // Global Marketplace
    globalMarketplace: 'वैश्विक बाजार',
    globalMarketplaceTitle: 'हमारे कला बाजार के माध्यम से दुनिया भर के कलाकारों, गैलरियों और कलेक्टरों से जुड़ें।',
    marketplaceStats: 'बाजार आंकड़े',
    globalUsers: 'वैश्विक उपयोगकर्ता',
    countries: 'देश',
    monthlySales: 'मासिक बिक्री',
    
    // Operating System
    operatingSystem: 'ऑपरेटिंग सिस्टम',
    operatingSystemTitle: 'इन्वेंटरी, विश्लेषण और वर्कफ्लो ऑटोमेशन के साथ पूर्ण कला प्रबंधन सिस्टम।',
    artManagement: 'कला प्रबंधन',
    totalArtworks: 'कुल कलाकृतियां',
    activeCollections: 'सक्रिय संग्रह',
    automationTasks: 'ऑटोमेशन कार्य',
    
    // Instant Settlements
    instantSettlements: 'तत्काल निपटान',
    instantSettlementsTitle: 'निर्बाध लेनदेन के लिए देरी या घर्षण के बिना भुगतान प्राप्त करें और संसाधित करें।',
    paymentProcessing: 'भुगतान प्रसंस्करण',
    instant: 'तत्काल',
    transactionSpeed: 'लेनदेन की गति',
    successRate: 'सफलता दर',
    processingFee: 'प्रसंस्करण शुल्क',
    
    // Digital Walls
    digitalWalls: 'डिजिटल दीवारें',
    digitalWallsTitle: 'QR कोड एक्सेस और डिजिटल गैलरियों के साथ आसानी से अपनी कला प्रदर्शित या सत्यापित करें।',
    qrCodeAccess: 'QR कोड एक्सेस',
    activeQrCodes: 'सक्रिय QR कोड',
    scansToday: 'आज के स्कैन',
    galleryViews: 'गैलरी दृश्य',
    
    // Digital Vault
    digitalVault: 'डिजिटल वॉल्ट',
    digitalVaultTitle: 'चेन-ऑन स्टोरेज और प्रीमियम एक्सेस कंट्रोल के साथ अपनी डिजिटल संपत्तियों को सुरक्षित करें।',
    digitalVaultAccess: 'डिजिटल वॉल्ट एक्सेस',
    vaultId: 'वॉल्ट ID',
    securityStatus: 'सुरक्षा स्थिति',
    accessLevel: 'एक्सेस स्तर',
    protected: 'संरक्षित',
    premium: 'प्रीमियम',
    
    // Price History
    priceHistory: 'मूल्य इतिहास',
    priceHistoryTitle: 'पूर्ण पारदर्शिता के साथ हर कलाकृति की मूल्य गति को ट्रैक और सत्यापित करें।',
    artworkValuation: 'कलाकृति मूल्यांकन',
    currentValue: 'वर्तमान मूल्य',
    purchasePrice: 'खरीद मूल्य',
    appreciation: 'मूल्य वृद्धि',
    
    // Language names
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    chinese: 'चीनी',
    spanish: 'स्पेनिश',
    french: 'फ्रेंच',
    arabic: 'अरबी',
    hindi: 'हिंदी',
    dutch: 'डच',
  },
  
  nl: {
    // Navigation
    home: 'Home',
    about: 'Over ons',
    services: 'Diensten',
    gallery: 'Galerij',
    contact: 'Contact',
    dashboard: 'Dashboard',
    profile: 'Profiel',
    settings: 'Instellingen',
    logout: 'Uitloggen',
    login: 'Inloggen',
    signup: 'Registreren',
    marketplace: 'Marktplaats',
    auctions: 'Veilingen',
    company: 'Bedrijf',
    news: 'Nieuws',
    careers: 'Carrières',
    aboutUs: 'Over Ons',
    contactUs: 'Neem Contact Op',
    operatingSystem: 'Besturingssysteem',
    visitOperatingSystem: 'Bezoek Besturingssysteem',
    getOperatingSystem: 'Krijg Besturingssysteem',
    wallet: 'Portemonnee',
    helpSupport: 'Hulp en Ondersteuning',
    loggedOutSuccessfully: 'Succesvol uitgelogd',
    failedToLogout: 'Uitloggen mislukt',
    
    // Company dropdown descriptions
    aboutDescription: 'Leer over onze missie en waarden',
    contactDescription: 'Neem contact op met ons team',
    newsDescription: 'Blijf op de hoogte van de laatste updates',
    careersDescription: 'Doe mee met ons groeiende team',
    
    // OS dropdown descriptions
    galleryOSDescription: 'Beheer uw galerie-operaties, bekijk analyses en verkoop kunst',
    artistOSDescription: 'Toon uw kunstwerk, volg prestaties en verdien royalty\'s',
    collectorOSDescription: 'Ontdek, verkoop en verzamel geweldige kunstwerken',
    
    // Home page
    heroTitle: 'EEN DATA-GEDREVEN BESTURINGSSYSTEEM VOOR DE MODERNE GALERIJ.',
    heroSubtitle: 'Technologie Gebruiken Om Kunst Slimmer Te Maken',
    heroHeadline: 'Culturele ruimtes omzetten in data-gedreven marktplaatsen',
    heroHeadlinePart1: 'Culturele',
    heroHeadlinePart2: 'ruimtes',
    heroHeadlinePart3a: 'omzetten',
    heroHeadlinePart3b: 'in',
    heroHeadlinePart4: 'data-gedreven',
    heroHeadlinePart5: 'marktplaatsen',
    heroHeadlinePart6: '',
    heroHeadlinePart7: '',
    
    // How it works section
    howItWorksTitle1: 'Hoe',
    howItWorksTitle2: ' het ',
    howItWorksTitle3: 'werkt.',
    howItWorksStep1: 'Verbind met Exo Sanctra',
    howItWorksStep2: 'Importeer je Kunstwerken, Verzamelobjecten en/of Objecten',
    howItWorksStep3: 'Lijst op onze wereldwijde, AI-aangedreven marktplaats',
    
    heroTagline: 'Technologie Gebruiken Om Kunst Slimmer Te Maken',
    getStarted: 'Aan de slag',
    learnMore: 'Meer weten',
    discoverArt: 'Kunst Ontdekken',
    viewAll: 'Alles Bekijken',
    featuredArtists: 'Uitgelichte Kunstenaars',
    featuredArtworks: 'Uitgelichte Kunstwerken',
    exploreMarketplace: 'Marktplaats Verkennen',
    
    // Common actions
    save: 'Opslaan',
    cancel: 'Annuleren',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    add: 'Toevoegen',
    remove: 'Verwijderen',
    search: 'Zoeken',
    filter: 'Filteren',
    sort: 'Sorteren',
    view: 'Bekijken',
    download: 'Downloaden',
    upload: 'Uploaden',
    theme: 'Thema',
    
    // Forms
    email: 'E-mail',
    password: 'Wachtwoord',
    confirmPassword: 'Wachtwoord bevestigen',
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    phone: 'Telefoon',
    address: 'Adres',
    city: 'Stad',
    country: 'Land',
    submit: 'Versturen',
    loading: 'Laden...',
    
    // Messages
    success: 'Succes',
    error: 'Fout',
    warning: 'Waarschuwing',
    info: 'Informatie',
    confirm: 'Bevestigen',
    areYouSure: 'Weet je het zeker?',
    yes: 'Ja',
    no: 'Nee',
    
    // Art related
    artwork: 'Kunstwerk',
    artist: 'Kunstenaar',
    title: 'Titel',
    description: 'Beschrijving',
    medium: 'Medium',
    dimensions: 'Afmetingen',
    year: 'Jaar',
    price: 'Prijs',
    category: 'Categorie',
    tags: 'Tags',
    
    // Gallery management
    inventory: 'Inventaris',
    analytics: 'Analytics',
    visitors: 'Bezoekers',
    sales: 'Verkopen',
    events: 'Evenementen',
    exhibitions: 'Tentoonstellingen',
    
    // Footer
    copyright: '© 2026 Exo Sanctra. Alle rechten voorbehouden.',
    privacyPolicy: 'Privacybeleid',
    termsOfService: 'Servicevoorwaarden',
    support: 'Ondersteuning',
    
    // Footer Sections
    legal: 'LEGAAL',
    help: 'HELP',
    aboutUs: 'OVER ONS',
    services: 'DIENSTEN',
    careers: 'CARRIÈRES',
    
    // Legal Section
    termsAndConditions: 'Algemene voorwaarden',
    privacy: 'Privacy',
    security: 'Beveiliging',
    cookieSettings: 'Cookie-instellingen',
    doNotSellPersonalInfo: 'Verkoop mijn persoonlijke informatie niet',
    
    // Help Section
    contactUs: 'Neem contact op',
    helpCenter: 'Helpcentrum',
    community: 'Gemeenschap',
    
    // About Us Section
    whoWeAre: 'Wie we zijn',
    ourMission: 'Onze missie',
    ourValues: 'Onze waarden',
    
    // Services Section
    galleryOperatingSystem: 'Galerij Besturingssysteem',
    artFinance: 'Kunstfinanciering',
    storage: 'Opslag',
    scanning3d2d: '3D/2D Scanning',
    
    // Careers Section
    internships: 'Stages',
    currentVacancies: 'Huidige Vacatures',
    artistPlacements: 'Kunstenaarsplaatsingen',
    engineers: 'Ingenieurs',
    
    // Feature Cards
    poweredBy: 'Aangedreven door',
    exhibitIQ: 'Exo Sanctra',
    featureCardsSubtitle: 'Ontdek de krachtige tools die Exo Sanctra het ultieme platform maken voor kunstbesturingssysteem en -beheer',
    
    // Home Page Hero Section
    sellFast: 'Verkoop',
    fast: 'Snel',
    on: 'op',
    sellFastSubtitle: 'Het enige all-in-one platform voor het laten groeien van je kunstbedrijf, verkoop en marketing van kunst, verzamelobjecten en objecten.',
    
    // Global Marketplace
    globalMarketplace: 'WERELDWIJDE MARKTPLAATS',
    globalMarketplaceTitle: 'Maak verbinding met kunstenaars, galerijen en verzamelaars wereldwijd via onze kunstmarktplaats.',
    marketplaceStats: 'Marktplaats Statistieken',
    globalUsers: 'Wereldwijde Gebruikers',
    countries: 'Landen',
    monthlySales: 'Maandelijkse Verkopen',
    
    // Operating System
    operatingSystem: 'BESTURINGSSYSTEEM',
    operatingSystemTitle: 'Volledig kunstbeheersysteem met voorraad, analyses en workflow-automatisering.',
    artManagement: 'Kunstbeheer',
    totalArtworks: 'Totaal Kunstwerken',
    activeCollections: 'Actieve Collecties',
    automationTasks: 'Automatiseringstaken',
    
    // Instant Settlements
    instantSettlements: 'DIRECTE AFREKENINGEN',
    instantSettlementsTitle: 'Ontvang en verwerk betalingen zonder vertraging of wrijving voor naadloze transacties.',
    paymentProcessing: 'Betalingsverwerking',
    instant: 'Direct',
    transactionSpeed: 'Transactiesnelheid',
    successRate: 'Succespercentage',
    processingFee: 'Verwerkingskosten',
    
    // Digital Walls
    digitalWalls: 'DIGITALE MUREN',
    digitalWallsTitle: 'Toon of verifieer eenvoudig je kunst met QR-code-toegang en digitale galerijen.',
    qrCodeAccess: 'QR-code Toegang',
    activeQrCodes: 'Actieve QR-codes',
    scansToday: 'Scans Vandaag',
    galleryViews: 'Galerij Weergaven',
    
    // Digital Vault
    digitalVault: 'DIGITALE KLUIS',
    digitalVaultTitle: 'Beveilig je digitale activa met on-chain opslag en premium toegangscontrole.',
    digitalVaultAccess: 'Digitale Kluis Toegang',
    vaultId: 'Kluis ID',
    securityStatus: 'Beveiligingsstatus',
    accessLevel: 'Toegangsniveau',
    protected: 'Beschermd',
    premium: 'Premium',
    
    // Price History
    priceHistory: 'PRIJZGESCHIEDENIS',
    priceHistoryTitle: 'Volg en verifieer de prijsbeweging van elk kunstwerk met volledige transparantie.',
    artworkValuation: 'Kunstwerk Waardering',
    currentValue: 'Huidige Waarde',
    purchasePrice: 'Aankoopprijs',
    appreciation: 'Waardestijging',
    
    // Language names
    language: 'Taal',
    english: 'Engels',
    chinese: 'Chinees',
    spanish: 'Spaans',
    french: 'Frans',
    arabic: 'Arabisch',
    hindi: 'Hindi',
    dutch: 'Nederlands',
  }
};

// Create i18n context
const I18nContext = createContext();

// Hook to use translations
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

// Main translation function
export const t = (key, locale = 'en') => {
  return translations[locale]?.[key] || translations['en'][key] || key;
};

// Provider component
export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  
  // Load locale from localStorage on mount
  useEffect(() => {
    const preferredLocale = getUserPreferredLanguage();
    if (preferredLocale && translations[preferredLocale]) {
      setLocale(preferredLocale);
    }
  }, []);
  
  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('locale', locale);
    // Update document direction for RTL languages
    if (isRTL(locale)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [locale]);
  
  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  };
  
  const value = {
    locale,
    changeLocale,
    t: (key) => t(key, locale),
    availableLocales: Object.keys(translations),
    supportedLanguages: getSupportedLanguages(),
    isRTL: isRTL(locale),
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export default translations;
