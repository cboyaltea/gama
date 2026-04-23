import type { Config } from "@measured/puck";
import { Hero, type HeroProps } from "./components/Hero";
import { Heading, type HeadingProps } from "./components/Heading";
import { Text, type TextProps } from "./components/Text";
import { ImageBlock, type ImageBlockProps } from "./components/Image";
import { Button, type ButtonProps } from "./components/Button";
import { Columns, type ColumnsProps } from "./components/Columns";
import { Spacer, type SpacerProps } from "./components/Spacer";

export type PageProps = {
  title: string;
};

export type Components = {
  Hero: HeroProps;
  Heading: HeadingProps;
  Text: TextProps;
  ImageBlock: ImageBlockProps;
  Button: ButtonProps;
  Columns: ColumnsProps;
  Spacer: SpacerProps;
};

export const config: Config<Components, PageProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Titre de la page" },
    },
    defaultProps: { title: "Nouvelle page" },
    render: ({ children }) => <>{children}</>,
  },
  categories: {
    sections: { title: "Sections", components: ["Hero", "Columns"] },
    typography: { title: "Texte", components: ["Heading", "Text"] },
    media: { title: "Média", components: ["ImageBlock"] },
    interactive: { title: "Action", components: ["Button"] },
    layout: { title: "Mise en page", components: ["Spacer"] },
  },
  components: {
    Hero: {
      label: "Héros",
      fields: {
        eyebrow: { type: "text", label: "Surtitre" },
        title: { type: "text", label: "Titre" },
        subtitle: { type: "textarea", label: "Sous-titre" },
        ctaLabel: { type: "text", label: "Bouton — libellé" },
        ctaHref: { type: "text", label: "Bouton — lien" },
        background: {
          type: "select",
          label: "Fond",
          options: [
            { label: "Sombre", value: "dark" },
            { label: "Clair", value: "light" },
            { label: "Accent", value: "accent" },
          ],
        },
      },
      defaultProps: {
        eyebrow: "",
        title: "Un titre qui accroche",
        subtitle: "Une phrase de positionnement claire, directe et honnête.",
        ctaLabel: "Commencer",
        ctaHref: "#",
        background: "dark",
      },
      render: Hero,
    },
    Heading: {
      label: "Titre",
      fields: {
        text: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "Gauche", value: "left" },
            { label: "Centré", value: "center" },
          ],
        },
      },
      defaultProps: { text: "Titre de section", level: "h2", align: "left" },
      render: Heading,
    },
    Text: {
      label: "Paragraphe",
      fields: {
        body: { type: "textarea" },
        align: {
          type: "radio",
          options: [
            { label: "Gauche", value: "left" },
            { label: "Centré", value: "center" },
          ],
        },
      },
      defaultProps: {
        body: "Ajoute ici un paragraphe de contenu. Tu peux aussi demander à Claude de l'écrire pour toi.",
        align: "left",
      },
      render: Text,
    },
    ImageBlock: {
      label: "Image",
      fields: {
        src: { type: "text", label: "URL de l'image" },
        alt: { type: "text", label: "Texte alternatif" },
        caption: { type: "text", label: "Légende (facultatif)" },
      },
      defaultProps: {
        src: "https://placehold.co/1200x700/0f1b2d/b08a4a?text=Image",
        alt: "Illustration",
        caption: "",
      },
      render: ImageBlock,
    },
    Button: {
      label: "Bouton",
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "radio",
          options: [
            { label: "Plein", value: "solid" },
            { label: "Contour", value: "outline" },
          ],
        },
      },
      defaultProps: { label: "Cliquez ici", href: "#", variant: "solid" },
      render: Button,
    },
    Columns: {
      label: "Colonnes",
      fields: {
        columns: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            body: { type: "textarea" },
          },
          defaultItemProps: { title: "Titre", body: "Description courte." },
          getItemSummary: (col) => col.title || "Colonne",
        },
      },
      defaultProps: {
        columns: [
          { title: "Rigueur", body: "Exécution soignée du premier au dernier détail." },
          { title: "Écoute", body: "Un interlocuteur unique tout au long du projet." },
          { title: "Livraison", body: "Des échéances tenues et des budgets respectés." },
        ],
      },
      render: Columns,
    },
    Spacer: {
      label: "Espace",
      fields: {
        size: {
          type: "select",
          options: [
            { label: "Petit", value: "sm" },
            { label: "Moyen", value: "md" },
            { label: "Grand", value: "lg" },
          ],
        },
      },
      defaultProps: { size: "md" },
      render: Spacer,
    },
  },
};

export const emptyData = {
  root: { props: { title: "Nouvelle page" } },
  content: [],
  zones: {},
};
