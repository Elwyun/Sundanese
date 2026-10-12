import { useFeatureSupport } from "@canva/app-hooks";
import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  SegmentedControl,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { requestFontSelection } from "@canva/asset";
import type { FontRef } from "@canva/asset";
import { addElementAtPoint } from "@canva/design";
import { useIntl } from "react-intl";
import React from "react";
import { toLatin, toSundanese } from "sunda.js";
import * as styles from "styles/components.css";

type Mode = "latin-to-sunda" | "sunda-to-latin";

export const App = () => {
  const intl = useIntl();
  const isSupported = useFeatureSupport();

  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("latin-to-sunda");
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
    } catch {
      setOutput("");
    }
  };

  const handleModeChange = (value: string) => {
    setMode(value as Mode);
    // Swap input/output when switching direction for a smoother experience.
    if (output) {
      setInput(output);
      setOutput("");
    }
  };

  const handleFontSelection = async () => {
    const response = await requestFontSelection({
      selectedFontRef: selectedFont?.ref,
    });
    if (response.type === "completed") {
      setSelectedFont({
        ref: response.font.ref,
        name: response.font.name,
        previewUrl: response.font.previewUrl,
      });
    }
  };

  const handleAddToDesign = () => {
    if (!addElementSupported || !output) {
      return;
    }
    addElementAtPoint({
      type: "text",
      children: [output],
      fontRef: selectedFont?.ref,
    });
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const inputLabel =
    mode === "latin-to-sunda"
      ? intl.formatMessage({
          defaultMessage: "Teks Latin",
          description: "Label for the Latin text input field",
        })
      : intl.formatMessage({
          defaultMessage: "Teks Aksara Sunda",
          description: "Label for the Sundanese script input field",
        });

  const outputLabel =
    mode === "latin-to-sunda"
      ? intl.formatMessage({
          defaultMessage: "Hasil Aksara Sunda",
          description: "Label for the Sundanese script output preview",
        })
      : intl.formatMessage({
          defaultMessage: "Hasil Latin",
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
                defaultMessage: "Ketik teks di sini…",
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
            defaultMessage: "Konversi",
            description: "Button to convert the input text",
          })}
        </Button>

        {output && (
          <>
            <FormField
              label={outputLabel}
              control={(props) => (
                <MultilineInput
                  {...props}
                  value={output}
                  onChange={() => {}}
                  minRows={4}
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
                    defaultMessage: "Pilih Font",
                    description: "Button to open the font picker",
                  })}
              </Button>

              <Button
                variant="primary"
                onClick={handleAddToDesign}
                disabled={!addElementSupported || !output}
                stretch
              >
                {intl.formatMessage({
                  defaultMessage: "Tambahkan ke Design",
                  description: "Button to add the converted text to the design",
                })}
              </Button>

              <Button variant="tertiary" onClick={handleClear} stretch>
                {intl.formatMessage({
                  defaultMessage: "Bersihkan",
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
                "Ketik teks lalu tekan Konversi. Hasilnya akan tampil di sini.",
              description: "Empty state helper text",
            })}
          </Text>
        )}
      </Rows>
    </div>
  );
};
