import { base } from '@airtable/blocks';
import { FieldType } from '@airtable/blocks/models';
import { ColorPalette, colors, colorUtils, FieldPickerSynced, FormField, Input,InputSynced,TablePickerSynced, useGlobalConfig, ViewPickerSynced } from '@airtable/blocks/ui';
import React, { useEffect } from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { Sliders } from 'react-bootstrap-icons';
import Header from './Header';
import './Settings.scss';

const Settings = () => {
    const globalConfig = useGlobalConfig();

    const tableId = globalConfig.get('selectedTableId') as string;

    const table = base.getTableByIdIfExists(tableId);

    const backgroundColor = globalConfig.get('backgroundColor') as string;
    useEffect(() => {
        const root = window.document.documentElement;
        if (backgroundColor) {
            root.style.setProperty('--backgroundColor', colorUtils.getHexForColor(backgroundColor))
        }
    }, [backgroundColor]);
    const headerColor = globalConfig.get('headerColor') as string;
    useEffect(() => {
        const root = window.document.documentElement;
        if (headerColor) {
            root.style.setProperty('--headerColor', colorUtils.getHexForColor(headerColor))
        }
    }, [headerColor]);

    return (
        <>
            <Header title="App Settings" icon={<Sliders color="#5577AA" />} />
            <Tabs defaultActiveKey="configuration" className="configuration-tabs">
                <Tab eventKey="configuration" title="Configuration">
                    <Card className="configuration">
                        <FormField label="Table">
                            <TablePickerSynced globalConfigKey="selectedTableId" />
                        </FormField>
                        <FormField label="Github Token">
                            <InputSynced
                                globalConfigKey="ghPersonalToken"
                                placeholder="token"
                                width="320px"
                            />
                        </FormField>

                        <FormField label="Organization name">
                            <InputSynced
                                globalConfigKey="organizationName"
                                placeholder="Name"
                                width="320px"
                            />
                        </FormField>
                    </Card>
                </Tab>
                <Tab eventKey="colors" title="Colors">
                    {/* Color config example */}
                    <Card className="configuration colors">
                        <FormField label="Background Color">
                            <ColorPalette
                                onChange={newColor => globalConfig.setAsync('backgroundColor', newColor)}
                                allowedColors={Object.values(colors)}
                                width="150px"
                            />
                        </FormField>
                        <FormField label="Header Color">
                            <ColorPalette
                                onChange={newColor => globalConfig.setAsync('headerColor', newColor)}
                                allowedColors={Object.values(colors)}
                                width="150px"
                            />
                        </FormField>
                    </Card>
                </Tab>
                <Tab eventKey="about" title="About">
                    <Card className="configuration">
                        <p>An app to handle Organizations Teams from Github.</p>
                    </Card>
                </Tab>
                <Tab eventKey="license" title="License">
                    <Card className="configuration">
                        &copy; {new Date().getFullYear()} InAir Studio
                    </Card>
                </Tab>
            </Tabs>
        </>
    )
}

export default Settings;