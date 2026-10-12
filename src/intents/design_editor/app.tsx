import { useFeatureSupport } from "@canva/app-hooks";
import {
  Accordion,
  AccordionItem,
  Alert,
  Box,
  Button,
  FormField,
  ImageCard,
  MultilineInput,
  Rows,
  SegmentedControl,
  Select,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { requestFontSelection } from "@canva/asset";
import type { FontRef } from "@canva/asset";
import { addElementAtPoint } from "@canva/design";
import type { FontWeight } from "@canva/design";
import { useIntl } from "react-intl";
import React from "react";
import { toLatin, toSundanese } from "sunda.js";
import * as styles from "styles/components.css";

type Mode = "latin-to-sunda" | "sunda-to-latin";

type PresetId = "none" | "title" | "body" | "caption";

type Preset = {
  fontSize?: number;
  fontWeight?: FontWeight;
  textAlign?: "start" | "center" | "end" | "justify";
};

const PRESETS: Record<PresetId, Preset> = {
  none: {},
  title: { fontSize: 48, fontWeight: "bold", textAlign: "center" },
  body: { fontSize: 24, fontWeight: "normal", textAlign: "start" },
  caption: { fontSize: 14, fontWeight: "normal", textAlign: "start" },
};

export const App = () => {
  const intl = useIntl();
  const isSupported = useFeatureSupport();

  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("latin-to-sunda");
  const [preset, setPreset] = React.useState<PresetId>("none");
  const [error, setError] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [selectedFont, setSelectedFont] = React.useState<{
    ref?: FontRef;
    name?: string;
    previewUrl?: string;
  }>();

  const addElementSupported = isSupported(addElementAtPoint);
  const fontPickerSupported = isSupported(requestFontSelection);

  const convert = () => {
    try {
      const result =
        mode === "latin-to-sunda" ? toSundanese(input) : toLatin(input);
      setOutput(result);
      setError(null);
    } catch {
      setOutput("");
      setError(
        intl.formatMessage({
          defaultMessage:
            "Conversion failed. Please check that the text follows the Sundanese transliteration rules.",
          description: "Error shown when the text conversion fails",
        }),
      );
    }
  };

  const handleModeChange = (value: string) => {
    setMode(value as Mode);
    // Swap input/output when switching direction for a smoother experience.
    if (output) {
      setInput(output);
      setOutput("");
    }
    setError(null);
  };

  const handleFontSelection = async () => {
    try {
      const response = await requestFontSelection({
        selectedFontRef: selectedFont?.ref,
      });
      if (response.type === "completed") {
        setSelectedFont({
          ref: response.font.ref,
          name: response.font.name,
          previewUrl: response.font.previewUrl,
        });
        setError(null);
      }
    } catch {
      setError(
        intl.formatMessage({
          defaultMessage: "Could not open the font picker. Please try again.",
          description: "Error shown when the font picker fails to open",
        }),
      );
    }
  };

  const handleAddToDesign = async () => {
    if (!addElementSupported || !output) {
      return;
    }
    setIsAdding(true);
    try {
      await addElementAtPoint({
        type: "text",
        children: [output],
        fontRef: selectedFont?.ref,
        ...PRESETS[preset],
      });
      setError(null);
    } catch {
      setError(
        intl.formatMessage({
          defaultMessage:
            "Couldn't add the text to your design. Please try again.",
          description: "Error shown when adding the text to the design fails",
        }),
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const inputLabel =
    mode === "latin-to-sunda"
      ? intl.formatMessage({
          defaultMessage: "Latin text",
          description: "Label for the Latin text input field",
        })
      : intl.formatMessage({
          defaultMessage: "Sundanese script",
          description: "Label for the Sundanese script input field",
        });

  const outputLabel =
    mode === "latin-to-sunda"
      ? intl.formatMessage({
          defaultMessage: "Sundanese result",
          description: "Label for the Sundanese script output preview",
        })
      : intl.formatMessage({
          defaultMessage: "Latin result",
          description: "Label for the Latin output preview",
        });

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Title size="small">
          {intl.formatMessage({
            defaultMessage: "Aksara Sunda",
            description: "App title",
          })}
        </Title>

        <SegmentedControl
          value={mode}
          onChange={handleModeChange}
          options={[
            {
              value: "latin-to-sunda",
              label: intl.formatMessage({
                defaultMessage: "Latin → Sunda",
                description: "Mode option: Latin to Sundanese",
              }),
            },
            {
              value: "sunda-to-latin",
              label: intl.formatMessage({
                defaultMessage: "Sunda → Latin",
                description: "Mode option: Sundanese to Latin",
              }),
            },
          ]}
        />

        <FormField
          label={inputLabel}
          control={(props) => (
            <MultilineInput
              {...props}
              value={input}
              onChange={(value) => setInput(value)}
              placeholder={intl.formatMessage({
                defaultMessage: "Type text here…",
                description: "Placeholder for the text input",
              })}
              minRows={4}
            />
          )}
        />

        <Button
          variant="secondary"
          onClick={convert}
          disabled={!input.trim()}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Convert",
            description: "Button to convert the input text",
          })}
        </Button>

        {error && (
          <Alert tone="critical" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {output && (
          <>
            <FormField
              label={outputLabel}
              control={() => (
                <Box
                  className={styles.preview}
                  border="ui"
                  borderRadius="standard"
                  padding="2u"
                >
                  <Text size="medium">{output}</Text>
                </Box>
              )}
            />

            <FormField
              label={intl.formatMessage({
                defaultMessage: "Text style",
                description: "Label for the preset style selector",
              })}
              control={(props) => (
                <Select<PresetId>
                  {...props}
                  value={preset}
                  onChange={(value) => setPreset(value)}
                  options={[
                    {
                      value: "none",
                      label: intl.formatMessage({
                        defaultMessage: "No style",
                        description: "Preset option: no styling applied",
                      }),
                    },
                    {
                      value: "title",
                      label: intl.formatMessage({
                        defaultMessage: "Invitation title",
                        description: "Preset option: large centered title",
                      }),
                    },
                    {
                      value: "body",
                      label: intl.formatMessage({
                        defaultMessage: "Body text",
                        description: "Preset option: regular body text",
                      }),
                    },
                    {
                      value: "caption",
                      label: intl.formatMessage({
                        defaultMessage: "Small caption",
                        description: "Preset option: small caption text",
                      }),
                    },
                  ]}
                  stretch
                />
              )}
            />

            <Rows spacing="1u">
              <Button
                variant="secondary"
                onClick={handleFontSelection}
                disabled={!fontPickerSupported}
                stretch
              >
                {selectedFont?.name ||
                  intl.formatMessage({
                    defaultMessage: "Choose font",
                    description: "Button to open the font picker",
                  })}
              </Button>

              {selectedFont?.previewUrl && (
                <ImageCard
                  thumbnailUrl={selectedFont.previewUrl}
                  thumbnailHeight={80}
                  borderRadius="standard"
                  alt={intl.formatMessage(
                    {
                      defaultMessage: "Preview of the selected font: {font}",
                      description:
                        "Alt text for the selected font preview image",
                    },
                    { font: selectedFont.name ?? "" },
                  )}
                />
              )}

              <Button
                variant="primary"
                onClick={handleAddToDesign}
                disabled={!addElementSupported || !output || isAdding}
                stretch
              >
                {intl.formatMessage({
                  defaultMessage: "Add to design",
                  description: "Button to add the converted text to the design",
                })}
              </Button>

              <Button variant="tertiary" onClick={handleClear} stretch>
                {intl.formatMessage({
                  defaultMessage: "Clear",
                  description: "Button to clear the input and output",
                })}
              </Button>
            </Rows>
          </>
        )}

        {!output && (
          <Text tone="tertiary" alignment="center">
            {intl.formatMessage({
              defaultMessage:
                "Type text and press Convert. The result will appear here.",
              description: "Empty state helper text",
            })}
          </Text>
        )}

        <Accordion>
          <AccordionItem
            title={intl.formatMessage({
              defaultMessage: "Transliteration rules",
              description: "Title of the transliteration rules section",
            })}
          >
            <Rows spacing="1u">
              <Text size="small">
                {intl.formatMessage({
                  defaultMessage: "Ngalagéna are the base consonants (pa → ᮕ).",
                  description: "Transliteration rule about base consonants",
                })}
              </Text>
              <Text size="small">
                {intl.formatMessage({
                  defaultMessage:
                    "Rarangkén are the vowel marks added to a consonant (pi → ᮕᮤ, pu → ᮕᮥ).",
                  description: "Transliteration rule about vowel marks",
                })}
              </Text>
              <Text size="small">
                {intl.formatMessage({
                  defaultMessage:
                    "A consonant without a vowel is closed with pamaéh (p → ᮕ᮪).",
                  description: "Transliteration rule about dead consonants",
                })}
              </Text>
              <Text size="small">
                {intl.formatMessage({
                  defaultMessage:
                    "Numbers are wrapped in pipes automatically (17 → |᮱᮷|).",
                  description: "Transliteration rule about numbers",
                })}
              </Text>
              <Text size="small">
                {intl.formatMessage({
                  defaultMessage:
                    "Foreign sounds (f, q, v, x, z, kh, sy) have their own mappings.",
                  description: "Transliteration rule about foreign sounds",
                })}
              </Text>
            </Rows>
          </AccordionItem>
        </Accordion>
      </Rows>
    </div>
  );
};
