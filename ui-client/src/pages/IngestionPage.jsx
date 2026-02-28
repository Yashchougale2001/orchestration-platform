import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderIcon from "@mui/icons-material/Folder";
import LinkIcon from "@mui/icons-material/Link";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ingestionService } from "../features/ingestion/ingestionService";
import { useToast } from "../hooks/useToast";

/**
 * Ingestion page for uploading and ingesting documents
 * Supports file upload, folder path, and URL ingestion
 */
export const IngestionPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const toast = useToast();

  /**
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await ingestionService.ingestFile(selectedFile);
      setResult({
        type: "success",
        message: `File "${selectedFile.name}" ingested successfully!`,
      });
      toast.success("File ingested successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setResult({
        type: "error",
        message: error.response?.data?.detail || "Failed to ingest file",
      });
      toast.error("Failed to ingest file");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle folder ingestion
   */
  const handleFolderIngest = async () => {
    if (!folderPath.trim()) {
      toast.error("Please enter a folder path");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      await ingestionService.ingestFolder(folderPath.trim());
      setResult({
        type: "success",
        message: `Folder "${folderPath}" ingested successfully!`,
      });
      toast.success("Folder ingested successfully!");
      setFolderPath("");
    } catch (error) {
      setResult({
        type: "error",
        message: error.response?.data?.detail || "Failed to ingest folder",
      });
      toast.error("Failed to ingest folder");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle URL ingestion
   */
  const handleUrlIngest = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      await ingestionService.ingestUrl(url.trim());
      setResult({
        type: "success",
        message: `URL "${url}" ingested successfully!`,
      });
      toast.success("URL ingested successfully!");
      setUrl("");
    } catch (error) {
      setResult({
        type: "error",
        message: error.response?.data?.detail || "Failed to ingest URL",
      });
      toast.error("Failed to ingest URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Document Ingestion
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload documents to the knowledge base for RAG retrieval
      </Typography>

      {/* Loading indicator */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Result alert */}
      {result && (
        <Alert
          severity={result.type}
          sx={{ mb: 3 }}
          onClose={() => setResult(null)}
        >
          {result.message}
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab
            icon={<UploadFileIcon />}
            label="Upload File"
            iconPosition="start"
          />
          <Tab icon={<FolderIcon />} label="Folder Path" iconPosition="start" />
          <Tab icon={<LinkIcon />} label="URL" iconPosition="start" />
        </Tabs>

        {/* File Upload Tab */}
        {activeTab === 0 && (
          <Box>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.csv,.json,.xlsx,.md,.txt,.yaml,.yml"
              />
              <CloudUploadIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="body1" gutterBottom>
                {selectedFile ? selectedFile.name : "Click to select a file"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported: PDF, CSV, JSON, XLSX, MD, TXT, YAML
              </Typography>
            </Box>

            <Button
              onClick={handleFileUpload}
              loading={isLoading}
              disabled={!selectedFile}
              fullWidth
              sx={{ mt: 3 }}
            >
              Upload & Ingest
            </Button>
          </Box>
        )}

        {/* Folder Path Tab */}
        {activeTab === 1 && (
          <Box>
            <Input
              label="Folder Path"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="/path/to/documents"
              helperText="Enter the absolute path to the folder containing documents"
            />
            <Button
              onClick={handleFolderIngest}
              loading={isLoading}
              disabled={!folderPath.trim()}
              fullWidth
              sx={{ mt: 3 }}
            >
              Ingest Folder
            </Button>
          </Box>
        )}

        {/* URL Tab */}
        {activeTab === 2 && (
          <Box>
            <Input
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              helperText="Enter the URL of the document to ingest"
            />
            <Button
              onClick={handleUrlIngest}
              loading={isLoading}
              disabled={!url.trim()}
              fullWidth
              sx={{ mt: 3 }}
            >
              Ingest URL
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};
