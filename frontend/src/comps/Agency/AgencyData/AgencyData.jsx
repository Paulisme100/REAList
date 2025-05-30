import { useEffect, useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import agencyApi from "../../fetches/agency/agencyApi";
import { useNavigate } from "react-router-dom";
import {
    Paper, 
    Button,
    TextField,
    Typography,
    Grid,
    Divider} from "@mui/material";
import AgencyAuthStore from "../../stores/AgencyAuthStore";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const AgencyData = () => {

    const { agency, login: loginAgency} = AgencyAuthStore();
    const nav = useNavigate()
    const [form, setForm] = useState({
        company_name: "",
        company_email: "",
        company_phone: "",
        cui: "",
        head_office_address: "",
        commission_at_sale: "",
        commission_at_rent: "",
        logo_url: "",
    })

    const [logoFile, setLogoFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        if(agency)  {
            setForm({
                company_name: agency.company_name || "",
                company_email: agency.company_email || "",
                company_phone: agency.company_phone || "",
                cui: agency.cui || "",
                head_office_address: agency.head_office_address || "",
                commission_at_sale: agency.commission_at_sale || "",
                commission_at_rent: agency.commission_at_rent || "",
                logo_url: agency.logo_url || "",
            });

            if (agency.logo_url) {
                setPreviewUrl(`${SERVER_URL}${agency.logo_url}`);
            }
        }
    }, [agency])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (e) => {
        const formData = new FormData;
        
        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        if (logoFile) {
            formData.append("logo", logoFile);
        }

        const updatedAgency = await agencyApi.updateAgencyData(formData)
        loginAgency(updatedAgency)
        nav('/agency-main')
    }

    return (
        <>
            <Paper>
                <Typography variant="h5" gutterBottom>
                    Edit Agency Data
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Company Name" name="company_name" value={form.company_name} onChange={handleInputChange} fullWidth />
                    </Grid>

                     <Grid item xs={12} sm={6}>
                        <TextField label="Email" name="company_email" value={form.company_email} onChange={handleInputChange} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField label="Phone" name="company_phone" value={form.company_phone} onChange={handleInputChange} fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField label="CUI" name="cui" value={form.cui} onChange={handleInputChange} fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="Head Office Address" name="head_office_address" value={form.head_office_address} onChange={handleInputChange} fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Commission on Sale (%)" name="commission_at_sale" value={form.commission_at_sale} onChange={handleInputChange} fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Commission on Rent (%)" name="commission_at_rent" value={form.commission_at_rent} onChange={handleInputChange} fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Company Logo
                        </Typography>

                        {previewUrl ?  (
                            <img src={`${previewUrl}`} alt="logo preview" style={{ height: 120, marginBottom: 10 }} />
                        )  :                        
                        (
                            <Typography>No logo uploaded.</Typography>
                        )}

                        <label htmlFor="logo-upload">
                            <input type="file" style={{ display: "none" }}
                                id="logo-upload"
                                name="logo"
                                accept="image/*"
                                onChange={handleFileChange} 
                            />
                            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                                Upload Logo
                            </Button>
                        </label>
                    </Grid>

                </Grid>

                <Divider style={{ margin: "2rem 0" }} />

                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Paper>
        </>
    )
}

export default AgencyData