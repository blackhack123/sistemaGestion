-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 22-01-2019 a las 21:49:32
-- Versión del servidor: 5.6.41
-- Versión de PHP: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `test_2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas_areas`
--

CREATE TABLE IF NOT EXISTS `areas_areas` (
  `id` int(11) NOT NULL,
  `area` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `tipo_proceso` varchar(20) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fec_ingresa` datetime(6) DEFAULT NULL,
  `fec_modifica` datetime(6) DEFAULT NULL,
  `usuario_ing_id` int(11) DEFAULT NULL,
  `usuario_mod_id` int(11) DEFAULT NULL,
  `id_personal_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas_area_proceso`
--

CREATE TABLE IF NOT EXISTS `areas_area_proceso` (
  `id` int(11) NOT NULL,
  `rol` int(11) DEFAULT NULL,
  `personal_disponible` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `area_id` int(11),
  `personal_id` int(11),
  `proceso_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas_personal`
--

CREATE TABLE IF NOT EXISTS `areas_personal` (
  `id` int(11) NOT NULL,
  `rol` int(11) DEFAULT NULL,
  `personal_id` int(11) DEFAULT NULL,
  `procedimiento_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas_procesos`
--

CREATE TABLE IF NOT EXISTS `areas_procesos` (
  `id` int(11) NOT NULL,
  `proceso` varchar(150) COLLATE utf8_spanish2_ci NOT NULL,
  `docfile` varchar(200) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `url_carpeta` varchar(300) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `tipo_proceso` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `disponible` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `fec_ingresa` datetime(6) DEFAULT NULL,
  `fec_modifica` datetime(6) DEFAULT NULL,
  `usuario_ing_id` int(11) DEFAULT NULL,
  `usuario_mod_id` int(11) DEFAULT NULL,
  `estado_colaborador` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `estado_encargado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `observaciones_encargado` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado_lider` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `observaciones_lider` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado_admin` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `observaciones_admin` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `id_area_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_auditores`
--

CREATE TABLE IF NOT EXISTS `auditoria_auditores` (
  `id` int(11) NOT NULL,
  `id_area_id` int(11) DEFAULT NULL,
  `id_auditor_id` int(11) NOT NULL,
  `id_norma_id` int(11) DEFAULT NULL,
  `id_proceso_id` int(11) DEFAULT NULL,
  `proceso_clausula_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_auditorias`
--

CREATE TABLE IF NOT EXISTS `auditoria_auditorias` (
  `id` int(11) NOT NULL,
  `numero_auditoria` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `lugar` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `fec_inicio` date NOT NULL,
  `hora_inicio` time(6) DEFAULT NULL,
  `fec_fin` date NOT NULL,
  `hora_fin` time(6) DEFAULT NULL,
  `objetivo` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `id_area_id` int(11) NOT NULL,
  `id_auditor_id` int(11) NOT NULL,
  `id_clausula_id` int(11) DEFAULT NULL,
  `id_norma_id` int(11) NOT NULL,
  `id_proceso_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group`
--

CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(80) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group_permissions`
--

CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_permission`
--

CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can add permission', 2, 'add_permission'),
(5, 'Can change permission', 2, 'change_permission'),
(6, 'Can delete permission', 2, 'delete_permission'),
(7, 'Can add group', 3, 'add_group'),
(8, 'Can change group', 3, 'change_group'),
(9, 'Can delete group', 3, 'delete_group'),
(10, 'Can add user', 4, 'add_user'),
(11, 'Can change user', 4, 'change_user'),
(12, 'Can delete user', 4, 'delete_user'),
(13, 'Can add content type', 5, 'add_contenttype'),
(14, 'Can change content type', 5, 'change_contenttype'),
(15, 'Can delete content type', 5, 'delete_contenttype'),
(16, 'Can add session', 6, 'add_session'),
(17, 'Can change session', 6, 'change_session'),
(18, 'Can delete session', 6, 'delete_session'),
(19, 'Can add colaboradores', 7, 'add_colaboradores'),
(20, 'Can change colaboradores', 7, 'change_colaboradores'),
(21, 'Can delete colaboradores', 7, 'delete_colaboradores'),
(22, 'Can add cargo', 8, 'add_cargo'),
(23, 'Can change cargo', 8, 'change_cargo'),
(24, 'Can delete cargo', 8, 'delete_cargo'),
(25, 'Can add area personal', 9, 'add_areapersonal'),
(26, 'Can change area personal', 9, 'change_areapersonal'),
(27, 'Can delete area personal', 9, 'delete_areapersonal'),
(28, 'Can add personal', 10, 'add_personal'),
(29, 'Can change personal', 10, 'change_personal'),
(30, 'Can delete personal', 10, 'delete_personal'),
(31, 'Can add areas', 11, 'add_areas'),
(32, 'Can change areas', 11, 'change_areas'),
(33, 'Can delete areas', 11, 'delete_areas'),
(34, 'Can add procesos', 12, 'add_procesos'),
(35, 'Can change procesos', 12, 'change_procesos'),
(36, 'Can delete procesos', 12, 'delete_procesos'),
(37, 'Can add area_ proceso', 13, 'add_area_proceso'),
(38, 'Can change area_ proceso', 13, 'change_area_proceso'),
(39, 'Can delete area_ proceso', 13, 'delete_area_proceso'),
(40, 'Can add personal', 14, 'add_personal'),
(41, 'Can change personal', 14, 'change_personal'),
(42, 'Can delete personal', 14, 'delete_personal'),
(43, 'Can add tipo usuario', 15, 'add_tipousuario'),
(44, 'Can change tipo usuario', 15, 'change_tipousuario'),
(45, 'Can delete tipo usuario', 15, 'delete_tipousuario'),
(46, 'Can add usuario', 16, 'add_usuario'),
(47, 'Can change usuario', 16, 'change_usuario'),
(48, 'Can delete usuario', 16, 'delete_usuario'),
(49, 'Can add normas', 17, 'add_normas'),
(50, 'Can change normas', 17, 'change_normas'),
(51, 'Can delete normas', 17, 'delete_normas'),
(52, 'Can add clausulas', 18, 'add_clausulas'),
(53, 'Can change clausulas', 18, 'change_clausulas'),
(54, 'Can delete clausulas', 18, 'delete_clausulas'),
(55, 'Can add proceso clausula', 19, 'add_procesoclausula'),
(56, 'Can change proceso clausula', 19, 'change_procesoclausula'),
(57, 'Can delete proceso clausula', 19, 'delete_procesoclausula'),
(58, 'Can add auditores', 20, 'add_auditores'),
(59, 'Can change auditores', 20, 'change_auditores'),
(60, 'Can delete auditores', 20, 'delete_auditores'),
(61, 'Can add auditorias', 21, 'add_auditorias'),
(62, 'Can change auditorias', 21, 'change_auditorias'),
(63, 'Can delete auditorias', 21, 'delete_auditorias'),
(64, 'Can add documento', 22, 'add_documento'),
(65, 'Can change documento', 22, 'change_documento'),
(66, 'Can delete documento', 22, 'delete_documento'),
(67, 'Can add revision', 23, 'add_revision'),
(68, 'Can change revision', 23, 'change_revision'),
(69, 'Can delete revision', 23, 'delete_revision'),
(70, 'Can add sac', 24, 'add_sac'),
(71, 'Can change sac', 24, 'change_sac'),
(72, 'Can delete sac', 24, 'delete_sac'),
(73, 'Can add plan accion', 25, 'add_planaccion'),
(74, 'Can change plan accion', 25, 'change_planaccion'),
(75, 'Can delete plan accion', 25, 'delete_planaccion'),
(76, 'Can add estado', 26, 'add_estado'),
(77, 'Can change estado', 26, 'change_estado'),
(78, 'Can delete estado', 26, 'delete_estado'),
(79, 'Can add revision', 27, 'add_revision'),
(80, 'Can change revision', 27, 'change_revision'),
(81, 'Can delete revision', 27, 'delete_revision'),
(82, 'Can add revision plan', 28, 'add_revisionplan'),
(83, 'Can change revision plan', 28, 'change_revisionplan'),
(84, 'Can delete revision plan', 28, 'delete_revisionplan'),
(85, 'Can add objetivos', 29, 'add_objetivos'),
(86, 'Can change objetivos', 29, 'change_objetivos'),
(87, 'Can delete objetivos', 29, 'delete_objetivos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user`
--

CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) COLLATE utf8_spanish2_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `first_name` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `last_name` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `email` varchar(254) COLLATE utf8_spanish2_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_groups`
--

CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_user_permissions`
--

CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_admin_log`
--

CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8_spanish2_ci,
  `object_repr` varchar(200) COLLATE utf8_spanish2_ci NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext COLLATE utf8_spanish2_ci NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_content_type`
--

CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `model` varchar(100) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(13, 'areas', 'area_proceso'),
(11, 'areas', 'areas'),
(14, 'areas', 'personal'),
(12, 'areas', 'procesos'),
(20, 'auditoria', 'auditores'),
(21, 'auditoria', 'auditorias'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(22, 'documentos', 'documento'),
(23, 'documentos', 'revision'),
(29, 'indicadores', 'objetivos'),
(18, 'normas', 'clausulas'),
(17, 'normas', 'normas'),
(19, 'normas', 'procesoclausula'),
(9, 'personal', 'areapersonal'),
(8, 'personal', 'cargo'),
(10, 'personal', 'personal'),
(7, 'procesos', 'colaboradores'),
(26, 'sac', 'estado'),
(25, 'sac', 'planaccion'),
(27, 'sac', 'revision'),
(28, 'sac', 'revisionplan'),
(24, 'sac', 'sac'),
(15, 'seguridad', 'tipousuario'),
(16, 'seguridad', 'usuario'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_migrations`
--

CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` int(11) NOT NULL,
  `app` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2019-01-22 21:36:17.769457'),
(2, 'auth', '0001_initial', '2019-01-22 21:36:22.408737'),
(3, 'admin', '0001_initial', '2019-01-22 21:36:23.154242'),
(4, 'admin', '0002_logentry_remove_auto_add', '2019-01-22 21:36:23.262529'),
(5, 'personal', '0001_initial', '2019-01-22 21:36:24.314831'),
(6, 'areas', '0001_initial', '2019-01-22 21:36:27.831661'),
(7, 'areas', '0002_auto_20181001_1715', '2019-01-22 21:36:27.908155'),
(8, 'seguridad', '0001_initial', '2019-01-22 21:36:28.725771'),
(9, 'normas', '0001_initial', '2019-01-22 21:36:31.129195'),
(10, 'auditoria', '0001_initial', '2019-01-22 21:36:33.168046'),
(11, 'contenttypes', '0002_remove_content_type_name', '2019-01-22 21:36:33.972831'),
(12, 'auth', '0002_alter_permission_name_max_length', '2019-01-22 21:36:34.526359'),
(13, 'auth', '0003_alter_user_email_max_length', '2019-01-22 21:36:35.098458'),
(14, 'auth', '0004_alter_user_username_opts', '2019-01-22 21:36:35.165776'),
(15, 'auth', '0005_alter_user_last_login_null', '2019-01-22 21:36:35.564800'),
(16, 'auth', '0006_require_contenttypes_0002', '2019-01-22 21:36:35.595601'),
(17, 'auth', '0007_alter_validators_add_error_messages', '2019-01-22 21:36:35.663278'),
(18, 'documentos', '0001_initial', '2019-01-22 21:36:37.322191'),
(19, 'indicadores', '0001_initial', '2019-01-22 21:36:37.529840'),
(20, 'procesos', '0001_initial', '2019-01-22 21:36:38.283589'),
(21, 'sac', '0001_initial', '2019-01-22 21:36:43.993329'),
(22, 'sessions', '0001_initial', '2019-01-22 21:36:44.548299');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_session`
--

CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) COLLATE utf8_spanish2_ci NOT NULL,
  `session_data` longtext COLLATE utf8_spanish2_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('o80jmu8hsm3pzmcyyp156t4vhcs8il4q', 'ZmIzNjY4ZDU1YzhhZmUyNjNhMjk5MWIzMDRiNzgxOTVhYzA5ZjhjODp7fQ==', '2019-02-05 21:47:26.278507');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos_documento`
--

CREATE TABLE IF NOT EXISTS `documentos_documento` (
  `id` int(11) NOT NULL,
  `path` varchar(200) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `version` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fec_subido` date DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `procedimiento_id` int(11) DEFAULT NULL,
  `proceso_id` int(11) DEFAULT NULL,
  `subido_por_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos_revision`
--

CREATE TABLE IF NOT EXISTS `documentos_revision` (
  `id` int(11) NOT NULL,
  `fec_rev_director` date DEFAULT NULL,
  `estado_rev_director` int(11) NOT NULL,
  `observacion_rev_director` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fec_rev_lider` date DEFAULT NULL,
  `estado_rev_lider` int(11) NOT NULL,
  `observacion_rev_lider` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fec_rev_admin` date DEFAULT NULL,
  `estado_rev_admin` int(11) NOT NULL,
  `observacion_rev_admin` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `admin_id` int(11) NOT NULL,
  `director_id` int(11) NOT NULL,
  `documento_id` int(11) DEFAULT NULL,
  `lider_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicadores_objetivos`
--

CREATE TABLE IF NOT EXISTS `indicadores_objetivos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `objetivo` int(11) NOT NULL,
  `indicador` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `signo` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `operacion` int(11) NOT NULL,
  `ponderacion` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `periodos` int(11) DEFAULT NULL,
  `meta` int(11) NOT NULL,
  `observacion` varchar(200) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `fecha` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `normas_clausulas`
--

CREATE TABLE IF NOT EXISTS `normas_clausulas` (
  `id` int(11) NOT NULL,
  `clausula` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `detalle` longtext COLLATE utf8_spanish2_ci NOT NULL,
  `id_norma_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `normas_normas`
--

CREATE TABLE IF NOT EXISTS `normas_normas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `docfile` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `fec_ingresa` datetime(6) DEFAULT NULL,
  `fec_modifica` datetime(6) DEFAULT NULL,
  `usuario_ing_id` int(11) DEFAULT NULL,
  `usuario_mod_id` int(11) DEFAULT NULL,
  `auditor_lider_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `normas_procesoclausula`
--

CREATE TABLE IF NOT EXISTS `normas_procesoclausula` (
  `id` int(11) NOT NULL,
  `id_area_id` int(11) NOT NULL,
  `id_clausula_id` int(11) NOT NULL,
  `id_norma_id` int(11) NOT NULL,
  `id_proceso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_areapersonal`
--

CREATE TABLE IF NOT EXISTS `personal_areapersonal` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `personal_areapersonal`
--

INSERT INTO `personal_areapersonal` (`id`, `nombre`, `estado`, `descripcion`) VALUES
(1, 'Administracion', '1', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_cargo`
--

CREATE TABLE IF NOT EXISTS `personal_cargo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `personal_cargo`
--

INSERT INTO `personal_cargo` (`id`, `nombre`, `estado`, `descripcion`) VALUES
(1, 'Administrador', '1', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_personal`
--

CREATE TABLE IF NOT EXISTS `personal_personal` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `celular` varchar(10) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `correo` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `firma` varchar(200) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `id_areapersonal_id` int(11) DEFAULT NULL,
  `id_cargo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `personal_personal`
--

INSERT INTO `personal_personal` (`id`, `nombre`, `telefono`, `celular`, `correo`, `estado`, `firma`, `id_areapersonal_id`, `id_cargo_id`) VALUES
(1, 'Diego Avila', NULL, '0988288431', 'diego.loachamin@rgmanagementcorp.com', '1', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `procesos_colaboradores`
--

CREATE TABLE IF NOT EXISTS `procesos_colaboradores` (
  `id` int(11) NOT NULL,
  `id_area_id` int(11) DEFAULT NULL,
  `id_personal_id` int(11) NOT NULL,
  `id_proceso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sac_estado`
--

CREATE TABLE IF NOT EXISTS `sac_estado` (
  `id` int(11) NOT NULL,
  `estado_aprobacion` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `observaciones_aprobacion` longtext COLLATE utf8_spanish2_ci,
  `estado_cierre_accion` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fecha_cierre_accion` date DEFAULT NULL,
  `estado_detalle` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `observacion_detalle` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `sac_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sac_planaccion`
--

CREATE TABLE IF NOT EXISTS `sac_planaccion` (
  `id` int(11) NOT NULL,
  `detalle_plan_accion` longtext COLLATE utf8_spanish2_ci,
  `plazo_plan_accion` date DEFAULT NULL,
  `justificacion_plan` longtext COLLATE utf8_spanish2_ci,
  `observacion_plan` longtext COLLATE utf8_spanish2_ci,
  `estado_plan` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fecha_seguimiento` date DEFAULT NULL,
  `detalle_seguimiento` longtext COLLATE utf8_spanish2_ci,
  `observacion_seguimiento` longtext COLLATE utf8_spanish2_ci,
  `estado_seguimiento` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `responsable_plan_accion_id` int(11) DEFAULT NULL,
  `responsable_seguimiento_id` int(11) DEFAULT NULL,
  `sac_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sac_revision`
--

CREATE TABLE IF NOT EXISTS `sac_revision` (
  `id` int(11) NOT NULL,
  `fec_rev_director` date DEFAULT NULL,
  `observacion_rev_director` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado_rev_director` int(11) DEFAULT NULL,
  `fec_rev_auditor` date DEFAULT NULL,
  `observacion_rev_auditor` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `estado_rev_auditor` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `auditor_id` int(11) DEFAULT NULL,
  `auditoria_id` int(11) DEFAULT NULL,
  `director_id` int(11) DEFAULT NULL,
  `sac_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sac_revisionplan`
--

CREATE TABLE IF NOT EXISTS `sac_revisionplan` (
  `id` int(11) NOT NULL,
  `justificacion_responsable` longtext COLLATE utf8_spanish2_ci,
  `observacion_rev_responsable` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fec_rev_responsable` date DEFAULT NULL,
  `estado_rev_responsable` int(11) DEFAULT NULL,
  `justificacion_seguimiento` longtext COLLATE utf8_spanish2_ci,
  `observacion_rev_seguimiento` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fec_rev_seguimiento` date DEFAULT NULL,
  `estado_rev_seguimiento` int(11) DEFAULT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `responsable_id` int(11) DEFAULT NULL,
  `seguimiento_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sac_sac`
--

CREATE TABLE IF NOT EXISTS `sac_sac` (
  `id` int(11) NOT NULL,
  `numero_auditoria` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `tipo_solicitud` varchar(2) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `area` int(11) DEFAULT NULL,
  `origen` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `fecha_solicitud` date DEFAULT NULL,
  `criticidad` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `descripcion_hallazgo` longtext COLLATE utf8_spanish2_ci,
  `estado_cabecera` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `sac_jefe` varchar(1) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `observacion_cabecera` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `descripcion_correcion` longtext COLLATE utf8_spanish2_ci,
  `analisis_causa` longtext COLLATE utf8_spanish2_ci,
  `procedimiento_id` int(11) DEFAULT NULL,
  `responsable_id` int(11) DEFAULT NULL,
  `solicitante_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguridad_tipousuario`
--

CREATE TABLE IF NOT EXISTS `seguridad_tipousuario` (
  `id` int(11) NOT NULL,
  `tipo` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `detalle` varchar(50) COLLATE utf8_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seguridad_tipousuario`
--

INSERT INTO `seguridad_tipousuario` (`id`, `tipo`, `detalle`) VALUES
(1, 'Administrador', NULL),
(2, 'Auditor', NULL),
(3, 'Director de Area', NULL),
(4, 'Auditor Lider', NULL),
(5, 'Lider de Norma', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguridad_usuario`
--

CREATE TABLE IF NOT EXISTS `seguridad_usuario` (
  `id` int(11) NOT NULL,
  `usuario` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `clave` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `estado` varchar(1) COLLATE utf8_spanish2_ci NOT NULL,
  `fec_ingresa` datetime(6) DEFAULT NULL,
  `fec_modifica` datetime(6) DEFAULT NULL,
  `usuario_ing_id` int(11) DEFAULT NULL,
  `usuario_mod_id` int(11) DEFAULT NULL,
  `has_personal` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_usuario` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_area` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_norma` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_auditoria` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_documental` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_sac` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `has_indicadores` varchar(3) COLLATE utf8_spanish2_ci NOT NULL,
  `director` int(11) NOT NULL,
  `colaborador` int(11) NOT NULL,
  `auditor` int(11) NOT NULL,
  `auditor_lider` int(11) NOT NULL,
  `lider_norma` int(11) NOT NULL,
  `permiso_lectura` int(11) NOT NULL,
  `permiso_escritura` int(11) NOT NULL,
  `id_personal_id` int(11) DEFAULT NULL,
  `id_tipo_usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seguridad_usuario`
--

INSERT INTO `seguridad_usuario` (`id`, `usuario`, `clave`, `estado`, `fec_ingresa`, `fec_modifica`, `usuario_ing_id`, `usuario_mod_id`, `has_personal`, `has_usuario`, `has_area`, `has_norma`, `has_auditoria`, `has_documental`, `has_sac`, `has_indicadores`, `director`, `colaborador`, `auditor`, `auditor_lider`, `lider_norma`, `permiso_lectura`, `permiso_escritura`, `id_personal_id`, `id_tipo_usuario_id`) VALUES
(1, 'admin', '42d8aa7cde9c78c4757862d84620c335', '1', NULL, NULL, NULL, NULL, 'on', 'on', 'on', 'on', 'on', 'on', 'on', 'on', 0, 0, 0, 0, 0, 1, 1, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas_areas`
--
ALTER TABLE `areas_areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `areas_areas_555804fb` (`id_personal_id`);

--
-- Indices de la tabla `areas_area_proceso`
--
ALTER TABLE `areas_area_proceso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `areas_area_proceso_d266de13` (`area_id`),
  ADD KEY `areas_area_proceso_4df638e8` (`personal_id`),
  ADD KEY `areas_area_proceso_fc2b635f` (`proceso_id`);

--
-- Indices de la tabla `areas_personal`
--
ALTER TABLE `areas_personal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `areas_personal_personal_id_42014e30_fk_personal_personal_id` (`personal_id`),
  ADD KEY `areas_persona_procedimiento_id_45a4f152_fk_areas_area_proceso_id` (`procedimiento_id`);

--
-- Indices de la tabla `areas_procesos`
--
ALTER TABLE `areas_procesos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `areas_procesos_id_area_id_9606adff_fk_areas_areas_id` (`id_area_id`);

--
-- Indices de la tabla `auditoria_auditores`
--
ALTER TABLE `auditoria_auditores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auditoria_auditores_id_area_id_fbdb6a66_fk_areas_areas_id` (`id_area_id`),
  ADD KEY `auditoria_auditor_id_auditor_id_440fa58c_fk_seguridad_usuario_id` (`id_auditor_id`),
  ADD KEY `auditoria_auditores_id_norma_id_63c17229_fk_normas_normas_id` (`id_norma_id`),
  ADD KEY `auditoria_auditores_id_proceso_id_6a65e0bb_fk_areas_procesos_id` (`id_proceso_id`),
  ADD KEY `audito_proceso_clausula_id_72bb9094_fk_normas_procesoclausula_id` (`proceso_clausula_id`);

--
-- Indices de la tabla `auditoria_auditorias`
--
ALTER TABLE `auditoria_auditorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auditoria_auditorias_id_area_id_4d295c49_fk_areas_areas_id` (`id_area_id`),
  ADD KEY `auditoria_audit_id_auditor_id_1ab473b9_fk_auditoria_auditores_id` (`id_auditor_id`),
  ADD KEY `auditoria_auditor_id_clausula_id_bce6d1be_fk_normas_clausulas_id` (`id_clausula_id`),
  ADD KEY `auditoria_auditorias_id_norma_id_56407f63_fk_normas_normas_id` (`id_norma_id`),
  ADD KEY `auditoria_auditorias_id_proceso_id_4c801061_fk_areas_procesos_id` (`id_proceso_id`);

--
-- Indices de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissi_permission_id_84c5c92e_fk_auth_permission_id` (`permission_id`);

--
-- Indices de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indices de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indices de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_perm_permission_id_1fbb5f2c_fk_auth_permission_id` (`permission_id`);

--
-- Indices de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin__content_type_id_c4bce8eb_fk_django_content_type_id` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indices de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_de54fa62` (`expire_date`);

--
-- Indices de la tabla `documentos_documento`
--
ALTER TABLE `documentos_documento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documentos_docume_procedimiento_id_f9eebf7a_fk_areas_procesos_id` (`procedimiento_id`),
  ADD KEY `documentos_documento_proceso_id_f1d162d0_fk_areas_areas_id` (`proceso_id`),
  ADD KEY `documentos_docume_subido_por_id_f087910a_fk_personal_personal_id` (`subido_por_id`);

--
-- Indices de la tabla `documentos_revision`
--
ALTER TABLE `documentos_revision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documentos_revision_admin_id_cbb91879_fk_personal_personal_id` (`admin_id`),
  ADD KEY `documentos_revision_director_id_7bfd2256_fk_personal_personal_id` (`director_id`),
  ADD KEY `documentos_revi_documento_id_31ad8781_fk_documentos_documento_id` (`documento_id`),
  ADD KEY `documentos_revision_lider_id_6b1530e0_fk_personal_personal_id` (`lider_id`);

--
-- Indices de la tabla `indicadores_objetivos`
--
ALTER TABLE `indicadores_objetivos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `normas_clausulas`
--
ALTER TABLE `normas_clausulas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `normas_clausulas_a4bd419a` (`id_norma_id`);

--
-- Indices de la tabla `normas_normas`
--
ALTER TABLE `normas_normas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `normas_normas_auditor_lider_id_52759301_fk_personal_personal_id` (`auditor_lider_id`);

--
-- Indices de la tabla `normas_procesoclausula`
--
ALTER TABLE `normas_procesoclausula`
  ADD PRIMARY KEY (`id`),
  ADD KEY `normas_procesoclausula_id_area_id_8f0c6394_fk_areas_areas_id` (`id_area_id`),
  ADD KEY `normas_procesocla_id_clausula_id_176f6d70_fk_normas_clausulas_id` (`id_clausula_id`),
  ADD KEY `normas_procesoclausula_id_norma_id_d314e907_fk_normas_normas_id` (`id_norma_id`),
  ADD KEY `normas_procesoclausu_id_proceso_id_6e7441ef_fk_areas_procesos_id` (`id_proceso_id`);

--
-- Indices de la tabla `personal_areapersonal`
--
ALTER TABLE `personal_areapersonal`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal_cargo`
--
ALTER TABLE `personal_cargo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal_personal`
--
ALTER TABLE `personal_personal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `personal_id_areapersonal_id_8194544a_fk_personal_areapersonal_id` (`id_areapersonal_id`),
  ADD KEY `personal_personal_id_cargo_id_b258f8d6_fk_personal_cargo_id` (`id_cargo_id`);

--
-- Indices de la tabla `procesos_colaboradores`
--
ALTER TABLE `procesos_colaboradores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `procesos_colaboradores_id_area_id_e2e04c97_fk_areas_areas_id` (`id_area_id`),
  ADD KEY `procesos_colabor_id_personal_id_99bb575b_fk_personal_personal_id` (`id_personal_id`),
  ADD KEY `procesos_colaborador_id_proceso_id_7fafea43_fk_areas_procesos_id` (`id_proceso_id`);

--
-- Indices de la tabla `sac_estado`
--
ALTER TABLE `sac_estado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sac_estado_7b0b2732` (`sac_id`);

--
-- Indices de la tabla `sac_planaccion`
--
ALTER TABLE `sac_planaccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sac__responsable_plan_accion_id_988d4ca8_fk_personal_personal_id` (`responsable_plan_accion_id`),
  ADD KEY `sac__responsable_seguimiento_id_53631c70_fk_personal_personal_id` (`responsable_seguimiento_id`),
  ADD KEY `sac_planaccion_7b0b2732` (`sac_id`);

--
-- Indices de la tabla `sac_revision`
--
ALTER TABLE `sac_revision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sac_revision_admin_id_b833713c_fk_personal_personal_id` (`admin_id`),
  ADD KEY `sac_revision_auditor_id_d2c392d7_fk_personal_personal_id` (`auditor_id`),
  ADD KEY `sac_revision_auditoria_id_2cbbf764_fk_auditoria_auditorias_id` (`auditoria_id`),
  ADD KEY `sac_revision_director_id_bb947e3b_fk_personal_personal_id` (`director_id`),
  ADD KEY `sac_revision_7b0b2732` (`sac_id`);

--
-- Indices de la tabla `sac_revisionplan`
--
ALTER TABLE `sac_revisionplan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sac_revisionplan_plan_id_a1773733_fk_sac_planaccion_id` (`plan_id`),
  ADD KEY `sac_revisionplan_responsable_id_e2582295_fk_personal_personal_id` (`responsable_id`),
  ADD KEY `sac_revisionplan_seguimiento_id_77bc6631_fk_personal_personal_id` (`seguimiento_id`);

--
-- Indices de la tabla `sac_sac`
--
ALTER TABLE `sac_sac`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sac_sac_procedimiento_id_18067312_fk_areas_procesos_id` (`procedimiento_id`),
  ADD KEY `sac_sac_responsable_id_9bf02484_fk_personal_personal_id` (`responsable_id`),
  ADD KEY `sac_sac_solicitante_id_247abae0_fk_personal_personal_id` (`solicitante_id`);

--
-- Indices de la tabla `seguridad_tipousuario`
--
ALTER TABLE `seguridad_tipousuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `seguridad_usuario`
--
ALTER TABLE `seguridad_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seguridad_usuari_id_personal_id_555d4cbc_fk_personal_personal_id` (`id_personal_id`),
  ADD KEY `segurida_id_tipo_usuario_id_74772e4f_fk_seguridad_tipousuario_id` (`id_tipo_usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas_areas`
--
ALTER TABLE `areas_areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `areas_area_proceso`
--
ALTER TABLE `areas_area_proceso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `areas_personal`
--
ALTER TABLE `areas_personal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `areas_procesos`
--
ALTER TABLE `areas_procesos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auditoria_auditores`
--
ALTER TABLE `auditoria_auditores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auditoria_auditorias`
--
ALTER TABLE `auditoria_auditorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=88;
--
-- AUTO_INCREMENT de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT de la tabla `documentos_documento`
--
ALTER TABLE `documentos_documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `documentos_revision`
--
ALTER TABLE `documentos_revision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `indicadores_objetivos`
--
ALTER TABLE `indicadores_objetivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `normas_clausulas`
--
ALTER TABLE `normas_clausulas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `normas_normas`
--
ALTER TABLE `normas_normas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `normas_procesoclausula`
--
ALTER TABLE `normas_procesoclausula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `personal_areapersonal`
--
ALTER TABLE `personal_areapersonal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `personal_cargo`
--
ALTER TABLE `personal_cargo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `personal_personal`
--
ALTER TABLE `personal_personal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `procesos_colaboradores`
--
ALTER TABLE `procesos_colaboradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `sac_estado`
--
ALTER TABLE `sac_estado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `sac_planaccion`
--
ALTER TABLE `sac_planaccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `sac_revision`
--
ALTER TABLE `sac_revision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `sac_revisionplan`
--
ALTER TABLE `sac_revisionplan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `sac_sac`
--
ALTER TABLE `sac_sac`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `seguridad_tipousuario`
--
ALTER TABLE `seguridad_tipousuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `seguridad_usuario`
--
ALTER TABLE `seguridad_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `areas_areas`
--
ALTER TABLE `areas_areas`
  ADD CONSTRAINT `areas_areas_id_personal_id_26e4273e_fk_personal_personal_id` FOREIGN KEY (`id_personal_id`) REFERENCES `personal_personal` (`id`);

--
-- Filtros para la tabla `areas_area_proceso`
--
ALTER TABLE `areas_area_proceso`
  ADD CONSTRAINT `areas_area_proceso_area_id_e1dff7c9_fk_areas_areas_id` FOREIGN KEY (`area_id`) REFERENCES `areas_areas` (`id`),
  ADD CONSTRAINT `areas_area_proceso_personal_id_efdea96f_fk_personal_personal_id` FOREIGN KEY (`personal_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `areas_area_proceso_proceso_id_a05e15fb_fk_areas_procesos_id` FOREIGN KEY (`proceso_id`) REFERENCES `areas_procesos` (`id`);

--
-- Filtros para la tabla `areas_personal`
--
ALTER TABLE `areas_personal`
  ADD CONSTRAINT `areas_persona_procedimiento_id_45a4f152_fk_areas_area_proceso_id` FOREIGN KEY (`procedimiento_id`) REFERENCES `areas_area_proceso` (`id`),
  ADD CONSTRAINT `areas_personal_personal_id_42014e30_fk_personal_personal_id` FOREIGN KEY (`personal_id`) REFERENCES `personal_personal` (`id`);

--
-- Filtros para la tabla `areas_procesos`
--
ALTER TABLE `areas_procesos`
  ADD CONSTRAINT `areas_procesos_id_area_id_9606adff_fk_areas_areas_id` FOREIGN KEY (`id_area_id`) REFERENCES `areas_areas` (`id`);

--
-- Filtros para la tabla `auditoria_auditores`
--
ALTER TABLE `auditoria_auditores`
  ADD CONSTRAINT `audito_proceso_clausula_id_72bb9094_fk_normas_procesoclausula_id` FOREIGN KEY (`proceso_clausula_id`) REFERENCES `normas_procesoclausula` (`id`),
  ADD CONSTRAINT `auditoria_auditor_id_auditor_id_440fa58c_fk_seguridad_usuario_id` FOREIGN KEY (`id_auditor_id`) REFERENCES `seguridad_usuario` (`id`),
  ADD CONSTRAINT `auditoria_auditores_id_area_id_fbdb6a66_fk_areas_areas_id` FOREIGN KEY (`id_area_id`) REFERENCES `areas_areas` (`id`),
  ADD CONSTRAINT `auditoria_auditores_id_norma_id_63c17229_fk_normas_normas_id` FOREIGN KEY (`id_norma_id`) REFERENCES `normas_normas` (`id`),
  ADD CONSTRAINT `auditoria_auditores_id_proceso_id_6a65e0bb_fk_areas_procesos_id` FOREIGN KEY (`id_proceso_id`) REFERENCES `areas_procesos` (`id`);

--
-- Filtros para la tabla `auditoria_auditorias`
--
ALTER TABLE `auditoria_auditorias`
  ADD CONSTRAINT `auditoria_audit_id_auditor_id_1ab473b9_fk_auditoria_auditores_id` FOREIGN KEY (`id_auditor_id`) REFERENCES `auditoria_auditores` (`id`),
  ADD CONSTRAINT `auditoria_auditor_id_clausula_id_bce6d1be_fk_normas_clausulas_id` FOREIGN KEY (`id_clausula_id`) REFERENCES `normas_clausulas` (`id`),
  ADD CONSTRAINT `auditoria_auditorias_id_area_id_4d295c49_fk_areas_areas_id` FOREIGN KEY (`id_area_id`) REFERENCES `areas_areas` (`id`),
  ADD CONSTRAINT `auditoria_auditorias_id_norma_id_56407f63_fk_normas_normas_id` FOREIGN KEY (`id_norma_id`) REFERENCES `normas_normas` (`id`),
  ADD CONSTRAINT `auditoria_auditorias_id_proceso_id_4c801061_fk_areas_procesos_id` FOREIGN KEY (`id_proceso_id`) REFERENCES `areas_procesos` (`id`);

--
-- Filtros para la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissi_permission_id_84c5c92e_fk_auth_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Filtros para la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permissi_content_type_id_2f476e4b_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Filtros para la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_perm_permission_id_1fbb5f2c_fk_auth_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin__content_type_id_c4bce8eb_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `documentos_documento`
--
ALTER TABLE `documentos_documento`
  ADD CONSTRAINT `documentos_docume_procedimiento_id_f9eebf7a_fk_areas_procesos_id` FOREIGN KEY (`procedimiento_id`) REFERENCES `areas_procesos` (`id`),
  ADD CONSTRAINT `documentos_docume_subido_por_id_f087910a_fk_personal_personal_id` FOREIGN KEY (`subido_por_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `documentos_documento_proceso_id_f1d162d0_fk_areas_areas_id` FOREIGN KEY (`proceso_id`) REFERENCES `areas_areas` (`id`);

--
-- Filtros para la tabla `documentos_revision`
--
ALTER TABLE `documentos_revision`
  ADD CONSTRAINT `documentos_revi_documento_id_31ad8781_fk_documentos_documento_id` FOREIGN KEY (`documento_id`) REFERENCES `documentos_documento` (`id`),
  ADD CONSTRAINT `documentos_revision_admin_id_cbb91879_fk_personal_personal_id` FOREIGN KEY (`admin_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `documentos_revision_director_id_7bfd2256_fk_personal_personal_id` FOREIGN KEY (`director_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `documentos_revision_lider_id_6b1530e0_fk_personal_personal_id` FOREIGN KEY (`lider_id`) REFERENCES `personal_personal` (`id`);

--
-- Filtros para la tabla `normas_clausulas`
--
ALTER TABLE `normas_clausulas`
  ADD CONSTRAINT `normas_clausulas_id_norma_id_241f9403_fk_normas_normas_id` FOREIGN KEY (`id_norma_id`) REFERENCES `normas_normas` (`id`);

--
-- Filtros para la tabla `normas_normas`
--
ALTER TABLE `normas_normas`
  ADD CONSTRAINT `normas_normas_auditor_lider_id_52759301_fk_personal_personal_id` FOREIGN KEY (`auditor_lider_id`) REFERENCES `personal_personal` (`id`);

--
-- Filtros para la tabla `normas_procesoclausula`
--
ALTER TABLE `normas_procesoclausula`
  ADD CONSTRAINT `normas_procesocla_id_clausula_id_176f6d70_fk_normas_clausulas_id` FOREIGN KEY (`id_clausula_id`) REFERENCES `normas_clausulas` (`id`),
  ADD CONSTRAINT `normas_procesoclausu_id_proceso_id_6e7441ef_fk_areas_procesos_id` FOREIGN KEY (`id_proceso_id`) REFERENCES `areas_procesos` (`id`),
  ADD CONSTRAINT `normas_procesoclausula_id_area_id_8f0c6394_fk_areas_areas_id` FOREIGN KEY (`id_area_id`) REFERENCES `areas_areas` (`id`),
  ADD CONSTRAINT `normas_procesoclausula_id_norma_id_d314e907_fk_normas_normas_id` FOREIGN KEY (`id_norma_id`) REFERENCES `normas_normas` (`id`);

--
-- Filtros para la tabla `personal_personal`
--
ALTER TABLE `personal_personal`
  ADD CONSTRAINT `personal_id_areapersonal_id_8194544a_fk_personal_areapersonal_id` FOREIGN KEY (`id_areapersonal_id`) REFERENCES `personal_areapersonal` (`id`),
  ADD CONSTRAINT `personal_personal_id_cargo_id_b258f8d6_fk_personal_cargo_id` FOREIGN KEY (`id_cargo_id`) REFERENCES `personal_cargo` (`id`);

--
-- Filtros para la tabla `procesos_colaboradores`
--
ALTER TABLE `procesos_colaboradores`
  ADD CONSTRAINT `procesos_colabor_id_personal_id_99bb575b_fk_personal_personal_id` FOREIGN KEY (`id_personal_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `procesos_colaborador_id_proceso_id_7fafea43_fk_areas_procesos_id` FOREIGN KEY (`id_proceso_id`) REFERENCES `areas_procesos` (`id`),
  ADD CONSTRAINT `procesos_colaboradores_id_area_id_e2e04c97_fk_areas_areas_id` FOREIGN KEY (`id_area_id`) REFERENCES `areas_areas` (`id`);

--
-- Filtros para la tabla `sac_estado`
--
ALTER TABLE `sac_estado`
  ADD CONSTRAINT `sac_estado_sac_id_7c0ac05b_fk_sac_sac_id` FOREIGN KEY (`sac_id`) REFERENCES `sac_sac` (`id`);

--
-- Filtros para la tabla `sac_planaccion`
--
ALTER TABLE `sac_planaccion`
  ADD CONSTRAINT `sac__responsable_plan_accion_id_988d4ca8_fk_personal_personal_id` FOREIGN KEY (`responsable_plan_accion_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac__responsable_seguimiento_id_53631c70_fk_personal_personal_id` FOREIGN KEY (`responsable_seguimiento_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac_planaccion_sac_id_03d42ca1_fk_sac_sac_id` FOREIGN KEY (`sac_id`) REFERENCES `sac_sac` (`id`);

--
-- Filtros para la tabla `sac_revision`
--
ALTER TABLE `sac_revision`
  ADD CONSTRAINT `sac_revision_admin_id_b833713c_fk_personal_personal_id` FOREIGN KEY (`admin_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac_revision_auditor_id_d2c392d7_fk_personal_personal_id` FOREIGN KEY (`auditor_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac_revision_auditoria_id_2cbbf764_fk_auditoria_auditorias_id` FOREIGN KEY (`auditoria_id`) REFERENCES `auditoria_auditorias` (`id`),
  ADD CONSTRAINT `sac_revision_director_id_bb947e3b_fk_personal_personal_id` FOREIGN KEY (`director_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac_revision_sac_id_4e04ee6a_fk_sac_sac_id` FOREIGN KEY (`sac_id`) REFERENCES `sac_sac` (`id`);

--
-- Filtros para la tabla `sac_revisionplan`
--
ALTER TABLE `sac_revisionplan`
  ADD CONSTRAINT `sac_revisionplan_plan_id_a1773733_fk_sac_planaccion_id` FOREIGN KEY (`plan_id`) REFERENCES `sac_planaccion` (`id`),
  ADD CONSTRAINT `sac_revisionplan_responsable_id_e2582295_fk_personal_personal_id` FOREIGN KEY (`responsable_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac_revisionplan_seguimiento_id_77bc6631_fk_personal_personal_id` FOREIGN KEY (`seguimiento_id`) REFERENCES `personal_personal` (`id`);

--
-- Filtros para la tabla `sac_sac`
--
ALTER TABLE `sac_sac`
  ADD CONSTRAINT `sac_sac_procedimiento_id_18067312_fk_areas_procesos_id` FOREIGN KEY (`procedimiento_id`) REFERENCES `areas_procesos` (`id`),
  ADD CONSTRAINT `sac_sac_responsable_id_9bf02484_fk_personal_personal_id` FOREIGN KEY (`responsable_id`) REFERENCES `personal_personal` (`id`),
  ADD CONSTRAINT `sac_sac_solicitante_id_247abae0_fk_personal_personal_id` FOREIGN KEY (`solicitante_id`) REFERENCES `personal_personal` (`id`);

--
-- Filtros para la tabla `seguridad_usuario`
--
ALTER TABLE `seguridad_usuario`
  ADD CONSTRAINT `segurida_id_tipo_usuario_id_74772e4f_fk_seguridad_tipousuario_id` FOREIGN KEY (`id_tipo_usuario_id`) REFERENCES `seguridad_tipousuario` (`id`),
  ADD CONSTRAINT `seguridad_usuari_id_personal_id_555d4cbc_fk_personal_personal_id` FOREIGN KEY (`id_personal_id`) REFERENCES `personal_personal` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
